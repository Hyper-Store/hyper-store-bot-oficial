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

class ConfirmCloseTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "confirm-close-ticket") return;

        const ticketData: any = await new Database().get(`ticket.sessions.${interaction.channelId}`);

        if (ticketData.ownerId !== interaction.user.id) {
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
                    id: ticketData.ownerId,
                    deny: ["ViewChannel", "SendMessages", "ReadMessageHistory", "AddReactions", "AttachFiles"]
                }
            ]
        })

        const session_db = await new Database().db.get(`ticket.sessions.${interaction.channelId}`) as any;

        const message = await interaction.channel.messages.cache.get(session_db.messageId)

        await message?.edit({
            ...ClosedTicketMessage({
                interaction,
                client,
                type: session_db.type,
                reason: session_db.reason,
                createdAt: new Date(session_db.createdAt)
            })
        })

        await new Database().db.set(`ticket.sessions.${interaction.channelId}.closedAt`, new Date())

        interaction.update({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} Seu ticket foi fechado com sucesso!`)
            ],
            components: []
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ConfirmCloseTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}