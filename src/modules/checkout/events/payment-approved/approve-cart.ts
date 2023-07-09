import { Client } from "discord.js";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { CheckoutProductMessagePrivate } from "./messages/CheckoutProductMessagePrivate";
import { ProductStockModel } from "@/modules/product/models/product-stock.model";
import { ProductStockRepository } from "@/modules/product/repositories/product-stock.repository";
import { ProductModel } from "@/modules/product/models/product.model";
import { RabbitmqSingletonService } from "@/modules/@shared/services";

export class ApproveCartUsecase {
    static async execute(client: Client, { checkoutId, stocks }: ApproveCartUsecase.Input): Promise<boolean> {
        console.log("ApproveCartUsecases")
        const checkout = await CheckoutRepository.findById(checkoutId);
        const product = await ProductRepository.findById(checkout?.productId!);
        const owner = client.users.cache.get(checkout?.ownerId!);

        // const channel = client.channels.cache.get(checkout?.id!);
        // if (!channel || !channel.isTextBased()) return false;
        console.log(owner, checkout?.ownerId)
        if(!owner) return false;
        
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