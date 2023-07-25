

import { MercadopagoGateway } from "../../gateways"
import { MercadopagoRepository } from "../../repositories"
import { RabbitmqSingletonService } from "@/modules/@shared/services"


export class ApproveMercadopagoPaymentUsecase {

    static async execute({ mercadopagoPaymentId }: ApproveMercadopagoPaymentUsecase.Input): Promise<string | null> {
        const mercadopagoPayment = await MercadopagoRepository.findByPaymentId(mercadopagoPaymentId)
        if (!mercadopagoPayment) return "PaymentNotFound"

        if (mercadopagoPayment.status === "APPROVED") return "PaymentAlreadyApproved";

        mercadopagoPayment.status = "APPROVED"

        await MercadopagoRepository.update(mercadopagoPayment)

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "mercadopagoPayment",
            "mercadopagoPayment.approved",
            JSON.stringify(mercadopagoPayment)
        )

        return null;
    }
}

export namespace ApproveMercadopagoPaymentUsecase {

    export type Input = {
        mercadopagoPaymentId: string
    }
}

