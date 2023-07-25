import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { NotIsOwnerMessage } from "@/modules/ticket/@shared/not-is-owner/not-is-owner.message";
import { Collection, Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import fs from 'fs';
import { GeneratingLogsMessage } from "./messages/GeneratingLogs.message";
import { LogsPanelMessage } from "./messages/LogsPanel.message";
import { LogsSentMessage } from "./messages/LogsSent.message";
import { TicketRepository } from "@/modules/ticket/repositories/Ticket.repository";

class PainelMemberSaveLogsTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "panel-member-options") return;
        if (interaction.values[0] !== "save-logs") return;
        if (interaction.channel?.type !== Discord.ChannelType.GuildText) return;

        const ticketData = await TicketRepository.findById(interaction.channelId);

        if (ticketData?.ownerId !== interaction.user.id) {
            interaction.reply({ ...NotIsOwnerMessage({ interaction, client }) })
            return;
        }

        await interaction.update({ ...GeneratingLogsMessage({ client, interaction }) });

        const messages: any = (await interaction.channel?.messages.fetch() as any).filter((message: Discord.Message) => !message.author.bot)

        const file = {
            content: "",
            directory: `src/infra/tickets-backup/${ticketData.sessionId}.txt`
        }

        messages.forEach((message: Discord.Message) => {
            file.content += `${message.author.username} | ${message.createdAt.toLocaleString()}\n${message.content}\n\n`;
        });

        const buffer = Buffer.from(file.content, 'utf-8');

        interaction.user.send({ ...LogsPanelMessage({ buffer, client, interaction, ticketData }) })

        interaction.editReply({ ...LogsSentMessage({ client, interaction }) });
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PainelMemberSaveLogsTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}