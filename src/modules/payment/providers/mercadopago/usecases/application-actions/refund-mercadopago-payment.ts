import { EventEmitterSingleton } from "@/modules/@shared/providers"
import { MercadopagoRepository } from "../../repositories"
import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { MercadopagoGateway } from "../../gateways"


export class RefundMercadopagoPaymentUsecase {

    static async execute({ mercadopagoPaymentId }: RefundMercadopagoPaymentUsecase.Input) {
        const mercadopagoPayment = await MercadopagoRepository.findByPaymentId(mercadopagoPaymentId)
        if (!mercadopagoPayment) return

        const mercadopagoPaymentGateway = await MercadopagoGateway.findById(mercadopagoPayment.paymentId)
        if(mercadopagoPaymentGateway?.status !== "REFUNDED") return

        if(mercadopagoPayment.status === "REFUNDED") return

        mercadopagoPayment.status = "REFUNDED"

        await MercadopagoRepository.update(mercadopagoPayment)

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "mercadopagoPayment",
            "mercadopagoPayment.refunded",
            JSON.stringify(mercadopagoPayment)
        )
    }
}

export namespace RefundMercadopagoPaymentUsecase {
    
    export type Input = {
        mercadopagoPaymentId: string
    }
}