import { Client } from "discord.js";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { CheckoutProductMessagePrivate } from "./messages/CheckoutProductMessagePrivate";
import { ProductStockModel } from "@/modules/product/models/product-stock.model";
import { ProductStockRepository } from "@/modules/product/repositories/product-stock.repository";
import { ProductModel } from "@/modules/product/models/product.model";
import { RabbitmqSingletonService } from "@/modules/@shared/services";

export class ApproveCartUsecase {
    static async execute(client: Client, checkoutId: string) {
        const checkout = await CheckoutRepository.findById(checkoutId);
        const product = await ProductRepository.findById(checkout?.productId!);
        const owner = client.users.cache.get(checkout?.ownerId!);
        const stockCount = await ProductStockRepository.stockCount(product?.id!);

        const channel = client.channels.cache.get(checkout?.id!);
        if (!channel || !channel.isTextBased()) return;

        if (stockCount < checkout?.quantity!) {
            const rabbitmq = await RabbitmqSingletonService.getInstance()
            await rabbitmq.publishInExchange(
                "checkout",
                "checkout.failed_reserve_stock",
                JSON.stringify({ 
                    reason: "PRODUCT_OUT_OF_STOCK",
                    checkoutId: checkout?.id
                })
            )
            return
        };

        const stockProduct: ProductStockModel[] = []

        for (const stockKey of Object.keys(product?.stock!)) {
            if (stockProduct.length >= checkout?.quantity!) break;
            stockProduct.push(product?.stock![stockKey]!)
            await ProductStockRepository.delete(product?.id!, product?.stock![stockKey].id!)
        }


        owner?.send({
            ...await CheckoutProductMessagePrivate({
                client,
                user: owner,
                product: product!,
                stock: stockProduct,
                checkout: checkout!
            })
        })


    }
}