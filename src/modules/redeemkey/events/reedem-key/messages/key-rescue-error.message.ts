import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Interaction } from 'discord.js';

type Props = {
    interaction: Interaction
}

export const KeyRescueErrorMessage = (props: Props) => {
    return {
        content: `${props.interaction.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.error!)
                .setDescription(`> ${emojis.error} Infelizmente não foi possível te entregar o cargo, houve um erro!\nEntre em contato com a administração para mais informações.`)
        ],
        ephemeral: true
    }
}