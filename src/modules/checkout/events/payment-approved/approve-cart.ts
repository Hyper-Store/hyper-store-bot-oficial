import { Client } from "discord.js";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { CheckoutProductMessagePrivate } from "./messages/CheckoutProductMessagePrivate";
import { ProductStockModel } from "@/modules/product/models/product-stock.model";
import { ProductStockRepository } from "@/modules/product/repositories/product-stock.repository";
import { ProductModel } from "@/modules/product/models/product.model";
import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { CheckoutProductMessageChannel } from "./messages/CheckoutProductMessageChannel";

export class ApproveCartUsecase {
    static async execute(client: Client, { checkoutId, stocks }: ApproveCartUsecase.Input): Promise<void | boolean> {
        const checkout = await CheckoutRepository.findById(checkoutId);
        const product = await ProductRepository.findById(checkout?.productId!);
        const guild = await client.guilds.cache.get(process.env.GUILD_ID!);
        const channel = guild?.channels.cache.get(checkout?.id!);
        const owner = guild?.members.cache.get(checkout?.ownerId!);

        if (!owner || !channel || !channel.isTextBased()) return;

        await channel.send({
            ...await CheckoutProductMessageChannel({
                client,
                user: owner,
                product: product!,
                stock: stocks,
                checkout: checkout!
            })
        })

        owner?.send({
            ...await CheckoutProductMessagePrivate({
                client,
                user: owner,
                product: product!,
                stock: stocks,
                checkout: checkout!
            })
        })

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "checkout",
            "checkout.delivered",
            JSON.stringify({
                checkoutId: checkout?.id
            })
        )
        return true
    }
}

export namespace ApproveCartUsecase {

    export type Input = {
        checkoutId: string
        stocks: ProductStockModel[]
    }
}