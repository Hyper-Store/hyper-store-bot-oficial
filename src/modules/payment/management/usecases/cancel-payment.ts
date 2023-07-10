import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { PaymentManagementRepository } from "../repositories"


export class CancelPaymentUsecase {

    static async execute({ paymentManagementId }: CancelPaymentUsecase.Input): Promise<void> {

        const paymentManagementEntity = await PaymentManagementRepository.findById(paymentManagementId)
        if (!paymentManagementEntity) return

        if (paymentManagementEntity.isCancelled()) return

        paymentManagementEntity.cancel()

        await PaymentManagementRepository.update(paymentManagementEntity)

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "paymentManagement",
            "paymentManagement.cancelled",
            JSON.stringify({ ...paymentManagementEntity.toJSON() })
        )
    }
}

export namespace CancelPaymentUsecase {

    export type Input = {
        paymentManagementId: string
    }
}