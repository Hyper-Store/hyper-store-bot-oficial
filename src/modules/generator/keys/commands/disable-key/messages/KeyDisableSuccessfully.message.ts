import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction, InteractionReplyOptions } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client
}

const KeyDisableSuccessfullyMessage = (props: Props): InteractionReplyOptions => ({
    content: `||${props.interaction.user}||`,
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setDescription(`> ${emojis.success} Key desativada com sucesso!`)
    ],
    ephemeral: true
})

export { KeyDisableSuccessfullyMessage }