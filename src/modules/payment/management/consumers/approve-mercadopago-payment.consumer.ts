import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { ApprovePaymentUsecase } from "../usecases"

const approveMercadopagoPaymentConsumer = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    const queueName = "approveMercadopagoPaymentQueue"
    rabbitmq.assertQueue(queueName, { durable: true })
    rabbitmq.bindQueue(queueName, "mercadopagoPayment", "mercadopagoPayment.approved")
    rabbitmq.consume(queueName, async (message, channel) => {

        const msg = JSON.parse(message.content.toString())

        await ApprovePaymentUsecase.execute({
            paymentManagementId: msg.paymentManagementId
        })
    })
}

approveMercadopagoPaymentConsumer()

