import { PaymentManagementRepository } from "../repositories"

export class SetMercadopagoProviderUsecase {

    static async execute({ paymentManagementId, mercadopagoProviderId }: SetMercadopagoProviderUsecase.Input) {

        const paymentManagementEntity = await PaymentManagementRepository.findById(paymentManagementId)
        if(!paymentManagementEntity) return
        
        paymentManagementEntity.setMercadopagoProvider(mercadopagoProviderId)

        await PaymentManagementRepository.update(paymentManagementEntity)
    }
}

export namespace SetMercadopagoProviderUsecase {

    export type Input = {
        paymentManagementId: string
        mercadopagoProviderId: string
    }
}