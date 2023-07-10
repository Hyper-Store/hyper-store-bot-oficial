import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { CheckoutRepository } from "../repositories/Checkout.repository"

export class CheckCheckoutTimeoutUsecase {


    static async execute({ checkoutId }: CheckCheckoutTimeoutUsecase.Input): Promise<void> {

        const checkout = await CheckoutRepository.findById(checkoutId)
        if(!checkout) return;

        if(checkout.status === "PENDING"){
            const rabbitmq = await RabbitmqSingletonService.getInstance()
            await rabbitmq.publishInExchange(
                "checkout",
                "checkout.checkout_timeout_reached",
                JSON.stringify({ 
                    checkoutId: checkout?.id
                })
            )
        }

    }
}


export namespace CheckCheckoutTimeoutUsecase {

    export type Input = {
        checkoutId: string
    }
}