import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { PaymentManagementRepository } from "../repositories"

export class CancelPaymentProviderUsecase {

    static async execute({ checkoutId }: CancelPaymentProviderUsecase.Input): Promise<void> {

        const paymentManagementEntity = await PaymentManagementRepository.findById(checkoutId)
        if (!paymentManagementEntity) return

        if (paymentManagementEntity.isCancelled()) return

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "paymentManagement",
            "paymentManagement.cancel_payment",
            JSON.stringify({ 
                paymentManagementId: paymentManagementEntity.checkoutId,
                paymentProviderId: paymentManagementEntity.paymentProviderId
            })
        )

    }
}

export namespace CancelPaymentProviderUsecase {

    export type Input = {
        checkoutId: string
    }
}