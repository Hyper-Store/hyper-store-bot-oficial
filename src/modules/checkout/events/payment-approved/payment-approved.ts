import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { ApproveCartUsecase } from "./approve-cart";

class StartCheckoutPurchasesEvent extends BaseEvent {
    constructor() {
        super({
            event: "ready"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new StartCheckoutPurchasesEvent()
    buttonClickedEvent.setupConsumer(client)
}