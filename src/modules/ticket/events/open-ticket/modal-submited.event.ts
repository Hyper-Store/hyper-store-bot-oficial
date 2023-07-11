import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { formData } from "./open-ticket-select-menu.event";
import { Database } from "@/infra/app/setup-database";
import { randomUUID } from "crypto";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { GetUserNameLowerCase } from "@/modules/@shared/utils/get-user-name-lowercase";
import { OpenTicketMessage } from "../../@shared/ticket-messages/open-ticket.message";
import { DatabaseConfig } from "@/infra/app/setup-config";
import { TypeTicket } from "../../@shared/type-tickets/type-tickets";
import { TicketRepository } from "../../repositories/Ticket.repository";

export const ticketData = {
    id: "",
    sessionId: randomUUID(),
    ownerId: "",
    reason: "",
    messageId: "",
    createdAt: new Date()
}

class ButtonClickedEvent extends BaseEvent {
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

        await interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.loading} Seu ticket está sendo aberto, aguarde...`)
            ],
            ephemeral: true
        })

        const typeTicket = TypeTicket.find(type => type.id === formData.typeTicket)

        const channel_created = await interaction.guild?.channels.create({
            name: `${typeTicket?.emoji}・${typeTicket?.title}-${GetUserNameLowerCase(interaction.user.username)}`,
            parent: (await new DatabaseConfig().db.get('ticket.category_id') as string),
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
            ...OpenTicketMessage({
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

        interaction.editReply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.notifiy} Olá ${interaction.user}, seu ticket foi aberto em ${channel_created}`)
                    .setFooter({ text: "😁 Estou ancioso pare te ajudar! Mal posso esperar..." })
            ],
            components: [
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel('Ir para ticket')
                            .setEmoji('🎫')
                            .setStyle(5)
                            .setURL(channel_created?.url!)
                    )
            ]
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ButtonClickedEvent()
    buttonClickedEvent.setupConsumer(client)
}