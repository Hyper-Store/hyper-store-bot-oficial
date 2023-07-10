import { Client } from "discord.js";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { CloseChannelCheckoutRabbitMq } from "../../@shared/rabbitmq/close-channel-checkout.rabbitmq";
import { CancelCheckoutByInativityMessageChannel } from "./messages/CancelCheckoutByInativityMessageChannel";

export class CancelCheckoutUseCase {
    static async execute(client: Client, { checkoutId }: CancelCheckoutUseCase.Input): Promise<void | boolean> {
        const checkout = await CheckoutRepository.findById(checkoutId);
        const product = await ProductRepository.findById(checkout?.productId!);
        const guild = await client.guilds.cache.get(process.env.GUILD_ID!);
        const owner = guild?.members.cache.get(checkout?.ownerId!);

        if (!owner) return;
        await CloseChannelCheckoutRabbitMq.execute({ checkoutId })

        owner.send({
            ...await CancelCheckoutByInativityMessageChannel({
                client,
                product: product!,
                checkout: checkout!,
                user: owner
            })
        })
        return true
    }
}

export namespace CancelCheckoutUseCase {

    export type Input = {
        checkoutId: string
    }
}