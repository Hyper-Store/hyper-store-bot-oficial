import { Client } from "discord.js";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { ProductStockModel } from "@/modules/product/models/product-stock.model";
import { CheckoutMessageCancelledByStockNotAvaibleChannel } from "./messages/CheckoutMessageCancelledByStockNotAvaibleChannel";
import { CheckoutMessageCancelledByStockNotAvaiblePrivate } from "./messages/CheckoutMessageCancelledByStockNotAvaiblePrivate";

export class CancelCartUsecase {
    static async execute(client: Client, { checkoutId }: ApproveCartUsecase.Input): Promise<void | boolean> {
        const checkout = await CheckoutRepository.findById(checkoutId);
        const product = await ProductRepository.findById(checkout?.productId!);
        const guild = await client.guilds.cache.get(process.env.GUILD_ID!);
        const channel = guild?.channels.cache.get(checkout?.id!);
        const owner = guild?.members.cache.get(checkout?.ownerId!);

        if (!owner || !channel || !channel.isTextBased()) return;

        await owner.send({
            ...await CheckoutMessageCancelledByStockNotAvaiblePrivate({
                user: owner!,
                client,
                checkout: checkout!,
                product: product!
            })
        })

        await channel.send({
            ...await CheckoutMessageCancelledByStockNotAvaibleChannel({
                user: owner!,
                client
            })
        })

        setTimeout(() => {
            channel.delete();
        }, 10000);

        return true
    }
}

export namespace ApproveCartUsecase {

    export type Input = {
        checkoutId: string
    }
}