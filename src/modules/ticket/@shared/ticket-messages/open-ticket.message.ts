import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction } from 'discord.js';
import { Embed } from './base-ticket-message';

type Props = {
    interaction: Interaction,
    client: Client,
    type: string,
    reason: string,
    createdAt: Date,
    field?: Discord.APIEmbedField
}

const OpenTicketMessage = (props: Props) => {

    return {
        content: `||${props.interaction.user}||`,
        embeds: [Embed(props)],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('close-ticket')
                        .setEmoji(emojis.delete)
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel('Fechar')
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('panel-member')
                        .setEmoji(emojis.member)
                        .setLabel('Painel membro')
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

export { OpenTicketMessage }