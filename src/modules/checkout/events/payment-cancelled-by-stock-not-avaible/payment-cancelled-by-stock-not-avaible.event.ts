import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { CancelCartUsecase } from "./cancel-cart";

class PaymentCancelledByStockNotAvaibleEvent extends BaseEvent {
    constructor() {
        super({
            event: "ready"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        const queueName = "paymentCancelledByStockNotAvailableQueue"
        rabbitmq.assertQueue(queueName, { durable: true, })
        rabbitmq.bindQueue(queueName, "checkout", "checkout.failed_reserve_stock")
        rabbitmq.consume(queueName, async (message, channel) => {
            const msg = JSON.parse(message.content.toString())
            return await CancelCartUsecase.execute(client, { ...msg })
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PaymentCancelledByStockNotAvaibleEvent()
    buttonClickedEvent.setupConsumer(client)
}