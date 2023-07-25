

import { MercadopagoRepository } from "../../repositories"
import { RabbitmqSingletonService } from "@/modules/@shared/services"


export class ApproveMercadopagoPaymentManualUsecase {

    static async execute({ mercadopagoPaymentId }: ApproveMercadopagoPaymentManualUsecase.Input) {
        const mercadopagoPayment = await MercadopagoRepository.findByPaymentId(mercadopagoPaymentId)
        if (!mercadopagoPayment) return

        if(mercadopagoPayment.status === "APPROVED") return
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

export namespace ApproveMercadopagoPaymentManualUsecase {
    
    export type Input = {
        mercadopagoPaymentId: string
    }
}

