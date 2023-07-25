import { Client } from "discord.js";
import { ProductStockModel } from "@/modules/product/models/product-stock.model";
import { CheckoutRepository } from "../../repositories/Checkout.repository";

export class HandleReviewUsecase {
    static async execute(client: Client, { checkoutId }: HandleReviewUsecase.Input): Promise<void | boolean> {
        const checkout = await CheckoutRepository.findById(checkoutId);

        if (checkout?.reviewSent) return;

        await CheckoutRepository.update({
            ...checkout!,
            reviewSent: true
        })

        console.log('ta aqui');
    }
}

export namespace HandleReviewUsecase {
    export type Input = {
        checkoutId: string
    }
}