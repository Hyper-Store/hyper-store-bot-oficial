

import { MercadopagoGateway } from "../../gateways"
import { MercadopagoRepository } from "../../repositories"
import { RabbitmqSingletonService } from "@/modules/@shared/services"


export class ApproveMercadopagoPaymentUsecase {

    static async execute({ mercadopagoPaymentId }: ApproveMercadopagoPaymentUsecase.Input): Promise<boolean> {
        const mercadopagoPayment = await MercadopagoRepository.findByPaymentId(mercadopagoPaymentId)
        if (!mercadopagoPayment) return false

        if (mercadopagoPayment.status === "APPROVED") return false;

        mercadopagoPayment.status = "APPROVED"

        await MercadopagoRepository.update(mercadopagoPayment)

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "mercadopagoPayment",
            "mercadopagoPayment.approved",
            JSON.stringify(mercadopagoPayment)
        )

        return true;
    }
}

export namespace ApproveMercadopagoPaymentUsecase {

    export type Input = {
        mercadopagoPaymentId: string
    }
}

