import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { CancelCartUsecase } from "./cancel-cart";

class PaymentCancelledCheckoutEvent extends BaseEvent {
    constructor() {
        super({
            event: "ready"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        const queueName = "PaymentCancelledCheckoutQueue"
        rabbitmq.assertQueue(queueName, { durable: true, })
        rabbitmq.bindQueue(queueName, "paymentManagement", "paymentManagement.cancelled")
        rabbitmq.consume(queueName, async (message, channel) => {
            const msg = JSON.parse(message.content.toString())
            return await CancelCartUsecase.execute(client, { ...msg })
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PaymentCancelledCheckoutEvent()
    buttonClickedEvent.setupConsumer(client)
}