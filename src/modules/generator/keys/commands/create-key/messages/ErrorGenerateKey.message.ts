import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction, InteractionReplyOptions, InteractionUpdateOptions } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client,
    errorMessage: string
}

const ErrorGenerateKeyMessage = (props: Props): InteractionUpdateOptions => ({
    content: `||${props.interaction.user}||`,
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setDescription(`> ${emojis.error} Houve um erro ao tentar gerar sua key, provavelmente possa ser um erro do servidor ou falta de paramêtros na requisição!\nConsulte o erro: \`${props.errorMessage}\``)
            .setFooter({ text: `Isto pode demorar um pouco até que o servidor responda!` })
    ]
})

export { ErrorGenerateKeyMessage }