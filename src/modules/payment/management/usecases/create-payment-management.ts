import { PaymentManagementEntity } from "../entities"
import { PaymentManagementRepository } from "../repositories"

export class CreatePaymentManagementUsecase {

    async execute({ checkoutId }: CreatePaymentManagementUsecase.Input) {

        const paymentManagement = PaymentManagementEntity.create({ checkoutId })
        await PaymentManagementRepository.create(paymentManagement)
    }
}

export namespace CreatePaymentManagementUsecase {

    export type Input = {
        checkoutId: string
    }
}