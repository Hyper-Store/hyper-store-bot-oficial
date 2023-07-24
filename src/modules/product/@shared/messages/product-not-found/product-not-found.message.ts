import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction, InteractionUpdateOptions } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client
}

export const ProductNotFoundMessage = (props: Props): InteractionUpdateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.error} O produto selecionado não foi encontrado na base de dados!`)
        ],
        components: []
    }
}