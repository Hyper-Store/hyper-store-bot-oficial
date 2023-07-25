import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { ApproveCartUsecase } from "../payment-approved/approve-cart";
import { HandleReviewUsecase } from "./handle-review";

class PaymentApprovedCheckoutEvent extends BaseEvent {
    constructor() {
        super({
            event: "ready"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        const rabbitmq = await RabbitmqSingletonService.getInstance()
        const queueName = "handle-review-expiration"
        rabbitmq.assertQueue(queueName, { durable: true, })
        rabbitmq.consume(queueName, async (message, channel) => {
            const msg = JSON.parse(message.content.toString())
            return await HandleReviewUsecase.execute(client, { ...msg })
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PaymentApprovedCheckoutEvent()
    buttonClickedEvent.setupConsumer(client)
}