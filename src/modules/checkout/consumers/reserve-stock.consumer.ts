import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { ReserveStockUsecase } from "../usecases"

const reserveStockConsumer = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    const queueName = "reserveStockQueue"
    rabbitmq.assertQueue(queueName, { durable: true })
    rabbitmq.bindQueue(queueName, "paymentManagement", "paymentManagement.approved")

    rabbitmq.consume(queueName, async (message, channel) => {
        const msg = JSON.parse(message.content.toString())
        await ReserveStockUsecase.execute({
            checkoutId: msg.checkoutId
        })
    })
}

reserveStockConsumer()

