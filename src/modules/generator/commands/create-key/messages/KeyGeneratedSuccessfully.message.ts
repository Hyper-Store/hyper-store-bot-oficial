import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction, InteractionReplyOptions, InteractionUpdateOptions } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client
}

const KeyGeneratedSuccessfully = (props: Props): InteractionUpdateOptions => ({
    content: `||${props.interaction.user}||`,
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setDescription(`> ${emojis.success} Parabéns, todas as keys foram geradas com sucesso e todas foram enviadas em seu privado!`)
    ]
})

export { KeyGeneratedSuccessfully }