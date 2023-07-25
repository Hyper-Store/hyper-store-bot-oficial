import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { NotIsOwnerMessage } from "../../@shared/not-is-owner/not-is-owner.message";
import { CloseTicketCancelledMessage } from "./messages/close-ticket-cancelled.message";
import { TicketRepository } from "../../repositories/Ticket.repository";

class CancelCloseTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "cancel-close-ticket") return;

        const ticketData = await TicketRepository.findById(interaction.channelId);

        if (ticketData?.ownerId !== interaction.user.id) {
            interaction.reply({ ...NotIsOwnerMessage({ interaction, client }) })
            return;
        }

        interaction.update({ ...CloseTicketCancelledMessage({ client, interaction }) });
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new CancelCloseTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}