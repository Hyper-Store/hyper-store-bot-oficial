

import { MercadopagoGateway } from "../../gateways"
import { MercadopagoRepository } from "../../repositories"
import { RabbitmqSingletonService } from "@/modules/@shared/services"


export class ApproveMercadopagoPaymentUsecase {

    static async execute({ mercadopagoPaymentId }: ApproveMercadopagoPaymentUsecase.Input) {
        const mercadopagoPayment = await MercadopagoRepository.findByPaymentId(mercadopagoPaymentId)
        if (!mercadopagoPayment) return

        if(mercadopagoPayment.status === "APPROVED") return

        const mercadopagoPaymentGateway = await MercadopagoGateway.findById(mercadopagoPayment.paymentId)
        if(mercadopagoPaymentGateway?.status !== "APPROVED") return

        mercadopagoPayment.status = "APPROVED"

        await MercadopagoRepository.update(mercadopagoPayment)

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "mercadopagoPayment",
            "mercadopagoPayment.approved",
            JSON.stringify(mercadopagoPayment)
        )
    }
}

export namespace ApproveMercadopagoPaymentUsecase {
    
    export type Input = {
        mercadopagoPaymentId: string
    }
}

