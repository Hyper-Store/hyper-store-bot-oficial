import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction } from 'discord.js';
import { Embed } from './base-ticket-message';

type Props = {
    interaction: Interaction,
    client: Client,
    type: string,
    reason: string,
    createdAt: Date
}

const ClosedTicketMessage = (props: Props) => {

    return {
        content: `||${props.interaction.user}||`,
        embeds: [Embed({
            ...props, field: {
                name: '🔏 Fechado há',
                value: `<t:${Math.floor(new Date().getTime() / 1000)}:f> \`(\`<t:${Math.floor(new Date().getTime() / 1000)}:R>\`)\``
            }
        })],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('reopen-ticket')
                        .setEmoji('🔓')
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel('Abrir')
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('panel-member')
                        .setEmoji(emojis.member)
                        .setLabel('Painel membro')
                        .setDisabled(true)
                        .setStyle(Discord.ButtonStyle.Secondary)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('panel-team')
                        .setEmoji(emojis.team)
                        .setLabel('Painel equipe')
                        .setStyle(Discord.ButtonStyle.Secondary)
                )
        ]
    }
}

export { ClosedTicketMessage }