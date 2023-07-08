import { EventEmitterSingleton } from "@/modules/@shared/providers"
import { MercadopagoRepository } from "../../repositories"


export class CancelMercadopagoPaymentUsecase {

    static async execute({ mercadopagoPaymentId }: CancelMercadopagoPaymentUsecase.Input) {
        const mercadopagoPayment = await MercadopagoRepository.findByPaymentId(mercadopagoPaymentId)
        if (!mercadopagoPayment) return

        if(mercadopagoPayment.status === "CANCELLED") return

        mercadopagoPayment.status = "CANCELLED"

        await MercadopagoRepository.update(mercadopagoPayment)

        const eventEmitter = EventEmitterSingleton.getInstance()
        eventEmitter.emit("mercadopago.paymentCancelledEvent", mercadopagoPayment)
    }
}

export namespace CancelMercadopagoPaymentUsecase {

    export type Input = {
        mercadopagoPaymentId: string
    }
}