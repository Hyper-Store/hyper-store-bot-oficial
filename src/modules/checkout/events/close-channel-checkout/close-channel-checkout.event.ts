import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { CheckoutChannelDelete } from "./checkout-channel-delete";

class CloseChannelCheckoutEvent extends BaseEvent {
    constructor() {
        super({
            event: "ready"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        const rabbitmq = await RabbitmqSingletonService.getInstance()
        const queueName = "closeChannelCheckoutCommandQueue"
        rabbitmq.assertQueue(queueName, { durable: true, })
        rabbitmq.consume(queueName, async (message, channel) => {
            const msg = JSON.parse(message.content.toString())
            return await CheckoutChannelDelete.execute(client, { ...msg })
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new CloseChannelCheckoutEvent()
    buttonClickedEvent.setupConsumer(client)
}