
import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { RefundPaymentUsecase } from "../usecases"

const refundMercadopagoPaymentConsumer = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    const queueName = "refundMercadopagoPaymentQueue"
    rabbitmq.assertQueue(queueName, { durable: true })
    rabbitmq.bindQueue(queueName, "mercadopagoPayment", "mercadopagoPayment.refunded")
    rabbitmq.consume(queueName, async (message, channel) => {

        const msg = JSON.parse(message.content.toString())

        await RefundPaymentUsecase.execute({
            paymentManagementId: msg.paymentManagementId
        })
    })
}

refundMercadopagoPaymentConsumer()

