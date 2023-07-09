import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { PaymentManagementRepository } from "../repositories"


export class ApprovePaymentUsecase {

    static async execute({ paymentManagementId }: ApprovePaymentUsecase.Input): Promise<void> {

        const paymentManagementEntity = await PaymentManagementRepository.findById(paymentManagementId)
        if (!paymentManagementEntity) return

        paymentManagementEntity.approve()

        await PaymentManagementRepository.update(paymentManagementEntity)
        
        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "paymentManagement",
            "paymentManagement.approved",
            JSON.stringify({ ...paymentManagementEntity.toJSON() })
        )
    }
}

export namespace ApprovePaymentUsecase {

    export type Input = {
        paymentManagementId: string
    }
}