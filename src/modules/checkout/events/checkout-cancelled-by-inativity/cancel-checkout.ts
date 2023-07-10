import { Client } from "discord.js";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { RabbitmqSingletonService } from "@/modules/@shared/services";

export class CancelCheckoutUseCase {
    static async execute(client: Client, { checkoutId }: CancelCheckoutUseCase.Input): Promise<void | boolean> {
        const checkout = await CheckoutRepository.findById(checkoutId);
        const product = await ProductRepository.findById(checkout?.productId!);
        const guild = await client.guilds.cache.get(process.env.GUILD_ID!);
        const channel = guild?.channels.cache.get(checkout?.id!);
        const owner = guild?.members.cache.get(checkout?.ownerId!);

        if (!owner || !channel || !channel.isTextBased()) return;
        const rabbitmq = await RabbitmqSingletonService.getInstance()
        rabbitmq.publishInQueue('closeChannelCheckoutCommandQueue', JSON.stringify({
            checkoutId,
            time: 10000
        }))

        return true
    }
}

export namespace CancelCheckoutUseCase {

    export type Input = {
        checkoutId: string
    }
}