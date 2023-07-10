import { MercadopagoGateway } from "../../gateways"
import { MercadopagoRepository } from "../../repositories"


export class CancelMercadopagoPaymentUsecase {

    static async execute({ paymentId }: CancelMercadopagoPaymentUsecase.Input): Promise<void> {

        const mercadopagoPayment = await MercadopagoRepository.findByPaymentId(paymentId)
        console.log(mercadopagoPayment)
        if (!mercadopagoPayment) return
        await MercadopagoGateway.cancel(mercadopagoPayment.paymentId)
    }
}

export namespace CancelMercadopagoPaymentUsecase {

    export type Input = {
        paymentId: string
    }
}