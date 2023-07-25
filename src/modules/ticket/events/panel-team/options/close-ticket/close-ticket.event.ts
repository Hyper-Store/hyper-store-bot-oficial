import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { GetUserNameLowerCase } from "@/modules/@shared/utils/get-user-name-lowercase";
import { HasPermissionTeam } from "@/modules/ticket/@shared/has-permission-team/has-permission-team"; import { NotIsOwnerMessage } from "@/modules/ticket/@shared/not-is-owner/not-is-owner.message";
import { ClosedTicketMessage } from "@/modules/ticket/@shared/ticket-messages/closed-ticket.message";
import { TicketRepository } from "@/modules/ticket/repositories/Ticket.repository";
import { TicketConfigRepository } from "@/modules/ticket/repositories/TicketConfig.repository";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { TicketClosedSucessfullyMessage } from "./messages/ticket-closed-sucessfully.message";

class PainelTeamCloseTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "panel-team-options") return;
        if (interaction.values[0] !== "close-ticket") return;
        if (interaction.channel?.type !== Discord.ChannelType.GuildText) return;

        const ticketConfig = await TicketConfigRepository.getAllOption()
        const ticketData = await TicketRepository.findById(interaction.channelId);
        const ownerUser = interaction.guild?.members.cache.get(ticketData?.ownerId!)

        if (!HasPermissionTeam({ interaction, client, support_role: ticketConfig?.support_role! })) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: 'Suporte' }) })
            return;
        }

        await interaction.channel?.edit({
            name: `❌・${GetUserNameLowerCase(ownerUser?.user.username!)}`,
            parent: ticketConfig?.category_close_id,
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

        const message = await interaction.channel.messages.cache.get(ticketData?.messageId!)

        await message?.edit({
            ...ClosedTicketMessage({
                interaction,
                client,
                type: ticketData?.type!,
                reason: ticketData?.reason!,
                createdAt: new Date(ticketData?.createdAt!)
            })
        })

        await TicketRepository.update({
            ...ticketData!,
            closedAt: new Date()
        })

        interaction.update({ ...TicketClosedSucessfullyMessage({ client, interaction }) })
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PainelTeamCloseTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}