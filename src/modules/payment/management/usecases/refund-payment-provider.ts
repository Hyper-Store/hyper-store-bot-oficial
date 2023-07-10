import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { PaymentManagementRepository } from "../repositories"

export class RefundPaymentProviderUsecase {

    static async execute({ checkoutId }: RefundPaymentProviderUsecase.Input): Promise<void> {

        const paymentManagementEntity = await PaymentManagementRepository.findById(checkoutId)
        if (!paymentManagementEntity) return

        if (paymentManagementEntity.isRefunded()) return

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "paymentManagement",
            "paymentManagement.refund_payment",
            JSON.stringify({ 
                paymentManagementId: paymentManagementEntity.checkoutId,
                paymentProviderId: paymentManagementEntity.paymentProviderId
            })
        )

    }
}

export namespace RefundPaymentProviderUsecase {

    export type Input = {
        checkoutId: string
    }
}