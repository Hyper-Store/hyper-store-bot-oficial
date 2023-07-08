import { MercadopagoRepository } from "../../repositories"


export class RefundMercadopagoPaymentUsecase {

    static async execute({ mercadopagoPaymentId }: RefundMercadopagoPaymentUsecase.Input) {
        const mercadopagoPayment = await MercadopagoRepository.findByPaymentId(mercadopagoPaymentId)
        if (!mercadopagoPayment) return

        mercadopagoPayment.status = "REFUNDED"

        await MercadopagoRepository.update(mercadopagoPayment)
    }
}

export namespace RefundMercadopagoPaymentUsecase {
    
    export type Input = {
        mercadopagoPaymentId: string
    }
}