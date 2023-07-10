import { Client } from "discord.js"
import { CheckoutRepository } from "../../repositories/Checkout.repository"

export class CheckoutChannelDelete {
    static async execute(client: Client, { checkoutId, time }: CheckoutChannelDelete.Input) {
        const checkout = await CheckoutRepository.findById(checkoutId);
        const channel = client.channels.cache.get(checkout?.id!);

        if (!checkout || !channel) return;
        if (!time) {
            channel.delete()
            return
        }

        setTimeout(() => {
            channel.delete()
        }, time);

        return;
    }
}

export namespace CheckoutChannelDelete {
    export type Input = {
        checkoutId: string,
        time?: number | null
    }
}