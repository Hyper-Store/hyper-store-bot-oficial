import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { NotIsOwnerMessage } from "@/modules/ticket/@shared/not-is-owner/not-is-owner.message";
import { Collection, Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import fs from 'fs';

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

        const ticketData: any = await new Database().get(`ticket.sessions.${interaction.channelId}`);

        if (ticketData.ownerId !== interaction.user.id) {
            interaction.reply({ ...NotIsOwnerMessage({ interaction, client }) })
            return;
        }

        await interaction.update({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.loading} Estou realizando o backup das mensagens, aguarde por favor...`)
                    .setFooter({ text: '🐰 Pareçe chat isso..., Mais ja ta acabando tá bom?' })
            ],
            components: []
        })

        const messages: any = (await interaction.channel?.messages.fetch() as any).filter((message: Discord.Message) => !message.author.bot)

        const file = {
            content: "",
            directory: `src/infra/tickets-backup/${ticketData.sessionId}.txt`
        }

        messages.forEach((message: Discord.Message) => {
            file.content += `${message.author.username} | ${message.createdAt.toLocaleDateString()}\n${message.content}\n\n`;
        });

        const buffer = Buffer.from(file.content, 'utf-8');

        interaction.user.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setThumbnail(interaction.guild?.iconURL()!)
                    .setDescription(`> ${emojis.notifiy} Veja abaixo mais informações sobre o ticket!`)
                    .addFields(
                        {
                            name: `${emojis.member} ID Sessão:`,
                            value: `\`\`\`${ticketData.sessionId}\`\`\``
                        },
                        {
                            name: `${emojis.team} Canal:`,
                            value: `\`\`\`${interaction.channel?.name}\`\`\``
                        },
                        {
                            name: `${emojis.team} Protocolo:`,
                            value: `\`\`\`${interaction.channel?.id}\`\`\``
                        },
                        {
                            name: `${emojis.time} Ticket criado há:`,
                            value: `<t:${Math.floor(new Date(ticketData.createdAt).getTime() / 1000)}:f> \`(\`<t:${Math.floor(new Date(ticketData.createdAt).getTime() / 1000)}:R>\`)\``
                        },
                        {
                            name: `${emojis.time} Data de solicitação backup:`,
                            value: `<t:${Math.floor(new Date().getTime() / 1000)}:f> \`(\`<t:${Math.floor(new Date().getTime() / 1000)}:R>\`)\``
                        },
                    )
            ],
            files: [
                {
                    attachment: buffer,
                    name: `backup-${ticketData.sessionId}.txt`
                }
            ]
        })

        interaction.editReply({
            content: `||${interaction.user}||`,
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} O backup das conversas foi realizado com sucesso, e já está em seu privado disponível para download!`)
            ]
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PainelMemberSaveLogsTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}