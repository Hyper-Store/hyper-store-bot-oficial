import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { NotIsOwnerMessage } from "../../@shared/not-is-owner/not-is-owner.message";
import { GetUserNameLowerCase } from "@/modules/@shared/utils/get-user-name-lowercase";
import { ClosedTicketMessage } from "../../@shared/ticket-messages/closed-ticket.message";
import { DatabaseConfig } from "@/infra/app/setup-config";
import { TicketClosedSucessfullyMessage } from "./messages/ticket-closed-sucessfully.message";
import { TicketRepository } from "../../repositories/Ticket.repository";
import { TicketConfigRepository } from "../../repositories/TicketConfig.repository";

class ConfirmCloseTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "confirm-close-ticket") return;

        const ticketConfig = await TicketConfigRepository.getAllOption()
        const ticketData = await TicketRepository.findById(interaction.channelId);

        if (ticketData?.ownerId !== interaction.user.id) {
            interaction.reply({ ...NotIsOwnerMessage({ interaction, client }) })
            return;
        }

        if (interaction.channel?.type !== Discord.ChannelType.GuildText) return;

        await interaction.channel?.edit({
            name: `❌・${GetUserNameLowerCase(interaction.user.username)}`,
            parent: (await new DatabaseConfig().db.get('ticket.category_close_id') as string),
            permissionOverwrites: [
                {
                    id: interaction.guildId!,
                    deny: ["ViewChannel"]
                },
                {
                    id: ticketConfig?.support_role!,
                    allow: ["ViewChannel"],
                    deny: ["SendMessages", "ReadMessageHistory", "AddReactions", "AttachFiles"]
                },
                {
                    id: ticketData?.ownerId!,
                    deny: ["ViewChannel", "SendMessages", "ReadMessageHistory", "AddReactions", "AttachFiles"]
                }
            ]
        })

        const message = await interaction.channel.messages.cache.get(ticketData.messageId)

        await message?.edit({
            ...ClosedTicketMessage({
                interaction,
                client,
                type: ticketData.type,
                reason: ticketData.reason,
                createdAt: new Date(ticketData.createdAt)
            })
        })

        await TicketRepository.update({
            ...ticketData,
            closedAt: new Date()
        })

        interaction.update({ ...TicketClosedSucessfullyMessage({ client, interaction }) })
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ConfirmCloseTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}