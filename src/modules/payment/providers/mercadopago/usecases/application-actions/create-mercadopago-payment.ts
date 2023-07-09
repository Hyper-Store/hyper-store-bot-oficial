import { RabbitmqServerProvider } from "@/modules/@shared/providers/rabbitmq-server-provider"
import { MercadopagoGateway } from "../../gateways"
import { MercadopagoRepository } from "../../repositories"
import { RabbitmqSingletonService } from "@/modules/@shared/services"


export class CreateMercadopagoPaymentUsecase {

    static async execute({ mercadopagoPaymentId }: CreateMercadopagoPaymentUsecase.Input) {

        const mercadoPagoPayment = await MercadopagoGateway.findById(mercadopagoPaymentId)
        if (!mercadoPagoPayment) return

        const paymentAlreadyExists = await MercadopagoRepository.findByPaymentId(mercadopagoPaymentId)
        if (paymentAlreadyExists) return

        await MercadopagoRepository.create(mercadoPagoPayment)

        
        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "mercadopagoPayment",
            "mercadopagoPayment.created",
            JSON.stringify(mercadoPagoPayment)
        )
    }
}

export namespace CreateMercadopagoPaymentUsecase {

    export type Input = {
        mercadopagoPaymentId: string
    }
}