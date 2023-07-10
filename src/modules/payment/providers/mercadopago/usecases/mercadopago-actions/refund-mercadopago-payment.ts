import { MercadopagoGateway } from "../../gateways"
import { MercadopagoRepository } from "../../repositories"


export class RefundMercadopagoPaymentUsecase {

    static async execute({ paymentId }: RefundMercadopagoPaymentUsecase.Input): Promise<void> {

        const mercadopagoPayment = await MercadopagoRepository.findByPaymentId(paymentId)
        if (!mercadopagoPayment) return
        await MercadopagoGateway.refund(mercadopagoPayment.paymentId)
    }
}

export namespace RefundMercadopagoPaymentUsecase {

    export type Input = {
        paymentId: string
    }
}