import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { CheckoutRepository } from "../repositories/Checkout.repository"

export class CancelCheckoutUsecase {

    static async execute({ checkoutId }: CancelCheckoutUsecase.Input): Promise<void> {

        const checkout = await CheckoutRepository.findById(checkoutId)
        if(!checkout) return

        checkout.status = "CANCELLED"

        await CheckoutRepository.update(checkout)

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "checkout",
            "checkout.cancelled",
            JSON.stringify({ 
                checkoutId: checkout?.id
            })
        )
    }
}

export namespace CancelCheckoutUsecase {

    export type Input = {
        checkoutId: string
    }
}