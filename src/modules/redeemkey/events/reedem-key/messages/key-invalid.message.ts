import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Interaction } from 'discord.js';

type Props = {
    interaction: Interaction,
    keyId: string
}

export const KeyInvalidMessage = (props: Props) => {
    return {
        content: `${props.interaction.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.error!)
                .setDescription(`> ${emojis.error} A key \`${props.keyId}\` pode estar inválida, ou não existe mais!`)
        ],
        ephemeral: true
    }
}