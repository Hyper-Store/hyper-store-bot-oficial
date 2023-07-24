import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction, InteractionReplyOptions } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client
}

const QueryingUserMessage = (props: Props): InteractionReplyOptions => ({
    content: `||${props.interaction.user}||`,
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setDescription(`> ${emojis.loading} Buscando informações o usuário...`)
            .setFooter({ text: `Isto pode demorar um pouco até que o servidor responda!` })
    ],
    ephemeral: true
})

export { QueryingUserMessage }