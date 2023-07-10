import { RabbitmqSingletonService } from "@/modules/@shared/services"
import {  } from "../usecases/application-actions"
import { RefundMercadopagoPaymentUsecase } from "../usecases/mercadopago-actions"

const refundPaymentConsumer = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    const queueName = "refundMercadopagoPaymentCommandQueue"
    rabbitmq.assertQueue(queueName, { durable: true })
    rabbitmq.bindQueue(queueName, "paymentManagement", "paymentManagement.refund_payment")
    rabbitmq.consume(queueName, async (message, channel) => {

        const msg = JSON.parse(message.content.toString())
        await RefundMercadopagoPaymentUsecase.execute({
            paymentId: msg.paymentProviderId
        })
    })
}

refundPaymentConsumer()

