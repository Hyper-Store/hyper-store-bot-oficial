import { RabbitmqServerProvider } from "@/modules/@shared/providers/rabbitmq-server-provider"
import { MercadopagoGateway } from "../../gateways"
import { MercadopagoRepository } from "../../repositories"


export class CreateMercadopagoPaymentUsecase {

    static async execute({ mercadopagoPaymentId }: CreateMercadopagoPaymentUsecase.Input) {

        const mercadoPagoPayment = await MercadopagoGateway.findById(mercadopagoPaymentId)
        if (!mercadoPagoPayment) return

        const paymentAlreadyExists = await MercadopagoRepository.findByPaymentId(mercadopagoPaymentId)
        if (paymentAlreadyExists) return

        await MercadopagoRepository.create(mercadoPagoPayment)

        const rabbitmq = new RabbitmqServerProvider(process.env.RABBITMQ_LOGIN_CREDENTIALS!)
        rabbitmq.start()
        await rabbitmq.assertExchange('payments', 'direct', { durable: true })
        await rabbitmq.publishInExchange('payments', 'payment.created', JSON.stringify(mercadoPagoPayment))
    }
}

export namespace CreateMercadopagoPaymentUsecase {

    export type Input = {
        mercadopagoPaymentId: string
    }
}