import { EventEmitterSingleton } from "@/modules/@shared/providers"
import { MercadopagoRepository } from "../../repositories"
import { RabbitmqSingletonService } from "@/modules/@shared/services"


export class CancelMercadopagoPaymentUsecase {

    static async execute({ mercadopagoPaymentId }: CancelMercadopagoPaymentUsecase.Input) {
        const mercadopagoPayment = await MercadopagoRepository.findByPaymentId(mercadopagoPaymentId)
        if (!mercadopagoPayment) return

        if(mercadopagoPayment.status === "CANCELLED") return

        mercadopagoPayment.status = "CANCELLED"

        await MercadopagoRepository.update(mercadopagoPayment)

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "mercadopagoPayment",
            "mercadopagoPayment.cancelled",
            JSON.stringify(mercadopagoPayment)
        )
    }
}

export namespace CancelMercadopagoPaymentUsecase {

    export type Input = {
        mercadopagoPaymentId: string
    }
}