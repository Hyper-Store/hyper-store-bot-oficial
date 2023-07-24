import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction, InteractionReplyOptions } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client,
    user: string
}

const UserNotFoundMessage = (props: Props): InteractionReplyOptions => ({
    content: `||${props.interaction.user}||`,
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.error!)
            .setDescription(`> ${emojis.error} O usuário \`${props.user}\` não foi encontrado no banco de dados ou não está mais disponível!`)
    ],
    ephemeral: true
})

export { UserNotFoundMessage }