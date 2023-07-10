import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { HasPermissionTeam } from "@/modules/ticket/@shared/has-permission-team/has-permission-team";
import { NotIsOwnerMessage } from "@/modules/ticket/@shared/not-is-owner/not-is-owner.message";
import { Collection, Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import fs from 'fs';

class PainelTeamSendNotifyTicketEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "panel-team-options") return;
        if (interaction.values[0] !== "send-notify") return;
        if (interaction.channel?.type !== Discord.ChannelType.GuildText) return;

        const ticketConfig: any = await new Database().get(`ticket.config`);
        const ticketData: any = await new Database().get(`ticket.sessions.${interaction.channelId}`);
        const ownerUser = interaction.guild?.members.cache.get(ticketData.ownerId)

        if (!HasPermissionTeam({ interaction, client, support_role: ticketConfig.support_role })) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: 'Suporte' }) })
            return;
        }

        await ownerUser?.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.notifiy} O staff ${interaction.user} está te aguardando no ticket ${interaction.channel}`)
                    .setFooter({ text: `😁 Abração do Kafka! ... Digo; Da equipe ${interaction.guild?.name}!` })
            ],
            components: [
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel('Ir para ticket')
                            .setEmoji('🎫')
                            .setStyle(5)
                            .setURL(interaction.channel.url)
                    )
            ]
        })

        interaction.update({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.notifiy} Notificação enviada com sucesso para o usuário ${ownerUser}`)
            ],
            components: []
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new PainelTeamSendNotifyTicketEvent()
    buttonClickedEvent.setupConsumer(client)
}