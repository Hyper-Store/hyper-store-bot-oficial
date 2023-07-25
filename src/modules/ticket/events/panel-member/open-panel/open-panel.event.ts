import { BaseEvent } from "@/modules/@shared/domain";
import { NotIsOwnerMessage } from "@/modules/ticket/@shared/not-is-owner/not-is-owner.message";
import { Interaction } from "discord.js";
import { Client } from "discord.js"
import { PanelMemberMessage } from "./messages/PanelMember.message";
import { TicketRepository } from "@/modules/ticket/repositories/Ticket.repository";

class PainelMemberOpenPanelTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "panel-member") return;

        const ticketData = await TicketRepository.findById(interaction.channelId);

        if (ticketData?.ownerId !== interaction.user.id) {
            interaction.reply({ ...NotIsOwnerMessage({ interaction, client }) })
            return;
        }

        interaction.reply({ ...PanelMemberMessage({ client, interaction }) });
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PainelMemberOpenPanelTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}