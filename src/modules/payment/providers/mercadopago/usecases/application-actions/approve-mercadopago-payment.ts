import { MercadopagoRepository } from "../../repositories"


export class ApproveMercadopagoPaymentUsecase {

    static async execute({ mercadopagoPaymentId }: ApproveMercadopagoPaymentUsecase.Input) {
        const mercadopagoPayment = await MercadopagoRepository.findByPaymentId(mercadopagoPaymentId)
        if (!mercadopagoPayment) return

        mercadopagoPayment.status = "APPROVED"

        await MercadopagoRepository.update(mercadopagoPayment)
    }
}

export namespace ApproveMercadopagoPaymentUsecase {
    
    export type Input = {
        mercadopagoPaymentId: string
    }
}