import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { RefundPaymentProviderUsecase } from "../usecases"

const refundPaymentProviderConsumer = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    const queueName = "refundPaymentProviderQueue"
    rabbitmq.assertQueue(queueName, { durable: true })
    rabbitmq.bindQueue(queueName, "checkout", "checkout.failed_reserve_stock")
    rabbitmq.consume(queueName, async (message, channel) => {

        const msg = JSON.parse(message.content.toString())

        await RefundPaymentProviderUsecase.execute({
            checkoutId: msg.checkoutId
        })
    })
}

refundPaymentProviderConsumer()
