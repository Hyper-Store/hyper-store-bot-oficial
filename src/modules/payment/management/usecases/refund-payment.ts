import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { PaymentManagementRepository } from "../repositories"


export class RefundPaymentUsecase {

    static async execute({ paymentManagementId }: RefundPaymentUsecase.Input): Promise<void> {

        const paymentManagementEntity = await PaymentManagementRepository.findById(paymentManagementId)
        if (!paymentManagementEntity) return

        if (paymentManagementEntity.isRefunded()) return

        paymentManagementEntity.refund()

        await PaymentManagementRepository.update(paymentManagementEntity)

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "paymentManagement",
            "paymentManagement.refunded",
            JSON.stringify({ ...paymentManagementEntity.toJSON() })
        )
    }
}

export namespace RefundPaymentUsecase {

    export type Input = {
        paymentManagementId: string
    }
}