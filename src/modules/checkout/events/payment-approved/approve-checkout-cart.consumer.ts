
import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { ApproveCartUsecase } from "./approve-cart"

const approveCheckoutCartConsumer = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    const queueName = "approveCheckoutQueue"
    rabbitmq.assertQueue(queueName, { durable: true })
    rabbitmq.bindQueue(queueName, "paymentManagement", "paymentManagement.approved")
    rabbitmq.consume(queueName, async (message, channel) => {
        const msg = JSON.parse(message.content.toString())

        ApproveCartUsecase.execute(msg.checkoutId)
    })
}

approveCheckoutCartConsumer()

