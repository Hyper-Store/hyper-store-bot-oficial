import { Client } from "discord.js";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";

export class CancelCheckoutUseCase {
    static async execute(client: Client, { checkoutId }: CancelCheckoutUseCase.Input): Promise<void | boolean> {
        const checkout = await CheckoutRepository.findById(checkoutId);
        const product = await ProductRepository.findById(checkout?.productId!);
        const guild = await client.guilds.cache.get(process.env.GUILD_ID!);
        const channel = guild?.channels.cache.get(checkout?.id!);
        const owner = guild?.members.cache.get(checkout?.ownerId!);

        if (!owner || !channel || !channel.isTextBased()) return;
        console.log('cancelado por inatividade')

        return true
    }
}

export namespace CancelCheckoutUseCase {

    export type Input = {
        checkoutId: string
    }
}