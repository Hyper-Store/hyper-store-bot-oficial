import { MercadopagoGateway } from "../../gateways"
import { MercadopagoRepository } from "../../repositories"


export class CreateMercadopagoPaymentUsecase {

    async execute({ mercadopagoPaymentId }: CreateMercadopagoPaymentUsecase.Input) {

        const mercadoPagoPayment = await MercadopagoGateway.findById(mercadopagoPaymentId)
        if (!mercadoPagoPayment) return


        const paymentAlreadyExists = await MercadopagoRepository.findByPaymentId(mercadopagoPaymentId)
        if (paymentAlreadyExists) return

        await MercadopagoRepository.create(mercadoPagoPayment)
    }
}

export namespace CreateMercadopagoPaymentUsecase {

    export type Input = {
        mercadopagoPaymentId: string
    }
}