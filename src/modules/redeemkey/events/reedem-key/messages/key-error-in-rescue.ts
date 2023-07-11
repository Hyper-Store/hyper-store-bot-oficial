import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Interaction } from 'discord.js';

type Props = {
    interaction: Interaction
}

export const KeyErrorInRescue = (props: Props) => {
    return {
        content: `${props.interaction.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.error!)
                .setDescription(`> ${emojis.error} Não foi possível encontrar o tipo de conteúdo a ser entregue, entre em contato com a administração para mais informações!!`)
        ],
        ephemeral: true
    }
}