import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { NotIsOwnerMessage } from "../../@shared/not-is-owner/not-is-owner.message";
import { GetUserNameLowerCase } from "@/modules/@shared/utils/get-user-name-lowercase";
import { TypeTicket } from "../../@shared/type-tickets/type-tickets";
import { SucessfullyReopenedTicket } from "./messages/sucessfully-reopened-ticket.message";
import { TicketRepository } from "../../repositories/Ticket.repository";
import { PanelTicketMessage } from "../../@shared/ticket-messages/panel-ticket.message";

class ReopenTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "reopen-ticket") return;

        const ticketData = await TicketRepository.findById(interaction.channelId);

        const ownerUser = interaction.guild?.members.cache.get(ticketData?.ownerId!)

        if (interaction.channel?.type !== Discord.ChannelType.GuildText) return;

        const typeTicket = TypeTicket.find(type => type.id === ticketData?.type)
        await interaction.channel?.edit({
            name: `${typeTicket?.emoji}}・${typeTicket?.title}-${GetUserNameLowerCase(ownerUser?.user.username!)}`,
            parent: (await new Database().db.get('ticket.config.category_id') as string),
            permissionOverwrites: [
                {
                    id: interaction.guildId!,
                    deny: ["ViewChannel"]
                },
                {
                    id: ticketData?.ownerId!,
                    allow: ["ViewChannel", "SendMessages", "ReadMessageHistory", "AddReactions", "AttachFiles"]
                }
            ]
        })

        const message = await interaction.channel.messages.cache.get(ticketData?.messageId!)

        const message_edited = await message?.edit({
            ...PanelTicketMessage({
                interaction,
                client,
                type: ticketData?.type!,
                reason: ticketData?.reason!,
                createdAt: new Date(ticketData?.createdAt!)
            })
        })

        await TicketRepository.update({
            ...ticketData!,
            messageId: message_edited?.id!,
            reopenedAt: new Date()
        })

        interaction.reply({ ...SucessfullyReopenedTicket({ client, interaction }) })
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ReopenTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}