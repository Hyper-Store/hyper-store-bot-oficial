import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import { Client } from "discord.js"
import { NotIsOwnerMessage } from "../../@shared/not-is-owner/not-is-owner.message";
import { TicketRepository } from "../../repositories/Ticket.repository";
import { ConfirmCloseTicketMessage } from "./messages/confirm-close-ticket.message";

class CloseTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "close-ticket") return;

        const ticketData = await TicketRepository.findById(interaction.channelId);

        if (ticketData?.ownerId !== interaction.user.id) {
            interaction.reply({ ...NotIsOwnerMessage({ interaction, client }) })
            return;
        }

        interaction.reply({ ...ConfirmCloseTicketMessage({ client, interaction }) });
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new CloseTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}