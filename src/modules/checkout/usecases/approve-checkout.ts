import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { CheckoutRepository } from "../repositories/Checkout.repository"


export class ApproveCheckoutUsecase {

    static async execute({ checkoutId }: ApproveCheckoutUsecase.Input) {

        
        const checkout = await CheckoutRepository.findById(checkoutId)
        if(!checkout) return

        checkout.status = "APPROVED"

        await CheckoutRepository.update(checkout)

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "checkout",
            "checkout.approved",
            JSON.stringify({ 
                checkoutId: checkout?.id
            })
        )
    }
}

export namespace ApproveCheckoutUsecase {
    
    export type Input = {
        checkoutId: string
    }
}