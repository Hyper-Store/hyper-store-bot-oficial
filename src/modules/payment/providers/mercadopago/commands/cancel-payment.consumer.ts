import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { CancelMercadopagoPaymentUsecase } from "../usecases/application-actions"

const cancelPaymentConsumer = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    const queueName = "cancelMercadopagoPaymentCommandQueue"
    rabbitmq.assertQueue(queueName, { durable: true })
    rabbitmq.bindQueue(queueName, "paymentManagement", "paymentManagement.cancel_payment")
    rabbitmq.consume(queueName, async (message, channel) => {

        const msg = JSON.parse(message.content.toString())

        await CancelMercadopagoPaymentUsecase.execute({
            mercadopagoPaymentId: msg.checkoutId
        })
    })
}

cancelPaymentConsumer()

