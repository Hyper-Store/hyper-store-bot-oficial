import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { CancelCheckoutUsecase } from "../usecases"

const cancelCheckoutConsumer = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    const queueName = "cancelCheckoutQueue"
    rabbitmq.assertQueue(queueName, { durable: true })
    rabbitmq.bindQueue(queueName, "paymentManagement", "paymentManagement.refunded")
    rabbitmq.bindQueue(queueName, "paymentManagement", "paymentManagement.cancelled")
    rabbitmq.bindQueue(queueName, "checkout", "checkout.checkout_timeout_reached")

    rabbitmq.consume(queueName, async (message, channel) => {
        const msg = JSON.parse(message.content.toString())
        await CancelCheckoutUsecase.execute({
            checkoutId: msg.checkoutId
        })
    })
}

cancelCheckoutConsumer()

