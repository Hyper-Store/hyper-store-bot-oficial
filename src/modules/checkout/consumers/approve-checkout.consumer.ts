import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { ApproveCheckoutUsecase } from "../usecases"

const approveCheckoutConsumer = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    const queueName = "approveCheckoutQueue"
    rabbitmq.assertQueue(queueName, { durable: true })
    rabbitmq.bindQueue(queueName, "checkout", "checkout.stock_reserved")

    rabbitmq.consume(queueName, async (message, channel) => {
        const msg = JSON.parse(message.content.toString())
        await ApproveCheckoutUsecase.execute({
            checkoutId: msg.checkoutId
        })
    })
}

approveCheckoutConsumer()

