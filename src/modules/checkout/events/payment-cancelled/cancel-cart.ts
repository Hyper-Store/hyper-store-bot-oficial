import { Client } from "discord.js";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { CloseChannelCheckoutRabbitMq } from "../../@shared/rabbitmq/close-channel-checkout.rabbitmq";
import { CheckoutMessageCancelledPrivate } from "./messages/CheckoutMessageCancelledPrivate";

export class CancelCartUsecase {
    static async execute(client: Client, { checkoutId }: CancelCartUsecase.Input): Promise<void | boolean> {
        const checkout = await CheckoutRepository.findById(checkoutId);
        const product = await ProductRepository.findById(checkout?.productId!);
        const guild = await client.guilds.cache.get(process.env.GUILD_ID!);
        const channel = guild?.channels.cache.get(checkout?.id!);
        const owner = guild?.members.cache.get(checkout?.ownerId!);

        if (!owner || !channel || !channel.isTextBased()) return;

        await CloseChannelCheckoutRabbitMq.execute({ checkoutId });

        await owner.send({
            ...await CheckoutMessageCancelledPrivate({
                user: owner!,
                client,
                checkout: checkout!,
                product: product!
            })
        })

        return true
    }
}

export namespace CancelCartUsecase {

    export type Input = {
        checkoutId: string
    }
}