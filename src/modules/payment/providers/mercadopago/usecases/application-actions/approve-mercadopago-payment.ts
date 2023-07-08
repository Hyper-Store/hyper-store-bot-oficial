import { EventEmitterSingleton } from "@/modules/@shared/providers"
import { MercadopagoRepository } from "../../repositories"


export class ApproveMercadopagoPaymentUsecase {

    static async execute({ mercadopagoPaymentId }: ApproveMercadopagoPaymentUsecase.Input) {
        const mercadopagoPayment = await MercadopagoRepository.findByPaymentId(mercadopagoPaymentId)
        if (!mercadopagoPayment) return

        if(mercadopagoPayment.status === "APPROVED") return

        mercadopagoPayment.status = "APPROVED"

        await MercadopagoRepository.update(mercadopagoPayment)

        const eventEmitter = EventEmitterSingleton.getInstance()
        eventEmitter.emit("mercadopago.paymentApprovedEvent", mercadopagoPayment)
    }
}

export namespace ApproveMercadopagoPaymentUsecase {
    
    export type Input = {
        mercadopagoPaymentId: string
    }
}