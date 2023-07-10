import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { CancelPaymentUsecase } from "../usecases"

const cancelMercadopagoPaymentConsumer = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    const queueName = "cancelMercadopagoPaymentQueue"
    rabbitmq.assertQueue(queueName, { durable: true })
    rabbitmq.bindQueue(queueName, "mercadopagoPayment", "mercadopagoPayment.cancelled")
    rabbitmq.bindQueue(queueName, "mercadopagoPayment", "mercadopagoPayment.refunded")
    rabbitmq.consume(queueName, async (message, channel) => {

        const msg = JSON.parse(message.content.toString())

        await CancelPaymentUsecase.execute({
            paymentManagementId: msg.paymentManagementId
        })
    })
}

cancelMercadopagoPaymentConsumer()

