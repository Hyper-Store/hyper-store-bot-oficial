import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { CheckoutRepository } from "../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { ProductStockRepository } from "@/modules/product/repositories/product-stock.repository";
import { ProductStockModel } from "@/modules/product/models/product-stock.model";

export class ReserveStockUsecase {


    static async execute({ checkoutId }: ReserveStockUsecase.Input) {

        const checkout = await CheckoutRepository.findById(checkoutId);
        const product = await ProductRepository.findById(checkout?.productId!);
        const stockCount = await ProductStockRepository.stockCount(product?.id!);

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

        const rabbitmq = await RabbitmqSingletonService.getInstance()
            await rabbitmq.publishInExchange(
                "checkout",
                "checkout.stock_reserved",
                JSON.stringify({ 
                    checkoutId: checkout?.id,
                    stocks: stockProduct
            })
        )
    }
}

export namespace ReserveStockUsecase {

    export type Input = {
        checkoutId: string
    }
}