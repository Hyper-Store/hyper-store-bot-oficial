import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { CheckoutRepository } from "../repositories/Checkout.repository"
import { PaymentManagementRepository } from "@/modules/payment/management/repositories";

export class CheckCheckoutTimeoutUsecase {


    static async execute({ checkoutId }: CheckCheckoutTimeoutUsecase.Input): Promise<void> {

        const checkout = await CheckoutRepository.findById(checkoutId)
        if (!checkout) return;

        const paymentManagement = await PaymentManagementRepository.findById(checkout.id)

        if(checkout.status !== "PENDING") return
        if(paymentManagement?.hasPaymentProvider()) return

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


export namespace CheckCheckoutTimeoutUsecase {

    export type Input = {
        checkoutId: string
    }
}