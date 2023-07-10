import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { NotIsOwnerMessage } from "../../@shared/not-is-owner/not-is-owner.message";
import { GetUserNameLowerCase } from "@/modules/@shared/utils/get-user-name-lowercase";
import { OpenTicketMessage } from "../../@shared/ticket-messages/open-ticket.message";
import { TypeTicket } from "../../@shared/type-tickets/type-tickets";

class ReopenTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "reopen-ticket") return;

        const ticketData: any = await new Database().get(`ticket.sessions.${interaction.channelId}`);

        const ownerUser = interaction.guild?.members.cache.get(ticketData.ownerId)

        if (interaction.channel?.type !== Discord.ChannelType.GuildText) return;

        const typeTicket = TypeTicket.find(type => type.id === ticketData.type)
        await interaction.channel?.edit({
            name: `${typeTicket?.emoji}}・${typeTicket?.title}-${GetUserNameLowerCase(ownerUser?.user.username!)}`,
            parent: (await new Database().db.get('ticket.config.category_id') as string),
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

        const session_db = await new Database().db.get(`ticket.sessions.${interaction.channelId}`) as any;

        const message = await interaction.channel.messages.cache.get(session_db.messageId)

        const message_edited = await message?.edit({
            ...OpenTicketMessage({
                interaction,
                client,
                type: session_db.type,
                reason: session_db.reason,
                createdAt: new Date(session_db.createdAt)
            })
        })

        await new Database().db.set(`ticket.sessions.${interaction.channelId}`, {
            ...session_db,
            messageId: message_edited?.id,
            closedAt: "",
            reopenedAt: new Date()
        })

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} Ticket do usuário ${ownerUser} aberto com sucesso!`)
            ],
            ephemeral: true
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ReopenTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}