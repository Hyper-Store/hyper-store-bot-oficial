import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { ResumeMessage } from "./@shared/_messages/Resume.message";
import { CheckoutRepository } from "../../repositories/Checkout.repository";

class StartCheckoutPurchasesEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'accept-cart') return;

        const checkout = await CheckoutRepository.findById(interaction.channelId);

        if (interaction.user.id !== checkout?.ownerId) return;

        interaction.update({ ...await ResumeMessage(interaction) })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new StartCheckoutPurchasesEvent()
    buttonClickedEvent.setupConsumer(client)
}