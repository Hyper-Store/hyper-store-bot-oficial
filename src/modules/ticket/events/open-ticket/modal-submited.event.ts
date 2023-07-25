import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import { Client } from "discord.js"
import { formData } from "./open-ticket-select-menu.event";
import { randomUUID } from "crypto";
import { GetUserNameLowerCase } from "@/modules/@shared/utils/get-user-name-lowercase";
import { TypeTicket } from "../../@shared/type-tickets/type-tickets";
import { TicketRepository } from "../../repositories/Ticket.repository";
import { TicketConfigRepository } from "../../repositories/TicketConfig.repository";
import { OpeningTicketMessage } from "./messages/OpeningTicket.message";
import { OpenTicketMessage } from "./messages/OpenTicket.message";
import { PanelTicketMessage } from "../../@shared/ticket-messages/panel-ticket.message";

export const ticketData = {
    id: "",
    sessionId: randomUUID(),
    ownerId: "",
    reason: "",
    messageId: "",
    createdAt: new Date()
}

class ModalSubmitedOpenTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "start_ticket") return;

        ticketData.ownerId = interaction.user.id
        ticketData.reason = interaction.fields.getTextInputValue("reason")

        await interaction.reply({ ...OpeningTicketMessage({ client, interaction }) })

        const typeTicket = TypeTicket.find(type => type.id === formData.typeTicket)
        const ticketConfig = await TicketConfigRepository.getAllOption()

        const channel_created = await interaction.guild?.channels.create({
            name: `${typeTicket?.emoji}・${typeTicket?.title}-${GetUserNameLowerCase(interaction.user.username)}`,
            parent: ticketConfig?.category_id,
            permissionOverwrites: [
                {
                    id: interaction.guildId!,
                    deny: ["ViewChannel"]
                },
                {
                    id: ticketData.ownerId,
                    allow: ["ViewChannel", "SendMessages", "ReadMessageHistory", "AddReactions", "AttachFiles"]
                }
            ]
        })

        ticketData.id = channel_created?.id!

        const message_created = await channel_created?.send({
            ...PanelTicketMessage({
                client,
                interaction,
                type: formData.typeTicket,
                reason: ticketData.reason,
                createdAt: ticketData.createdAt
            })
        })

        ticketData.messageId = message_created?.id!!

        await TicketRepository.create({
            id: ticketData.id,
            ownerId: interaction.user.id,
            reason: ticketData.reason,
            type: formData.typeTicket,
            messageId: ticketData.messageId,
            sessionId: ticketData.sessionId,
            createdAt: ticketData.createdAt
        })

        interaction.editReply({ ...OpenTicketMessage({ channel: channel_created!, client, interaction }) })
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ModalSubmitedOpenTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}