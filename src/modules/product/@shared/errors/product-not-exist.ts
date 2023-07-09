import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord from 'discord.js';

export const ProductNotExistError = ({
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.error!)
            .setDescription(`> ${emojis.error} Infelizmente o produto solicitado não existe mais ou está com problema!`)
    ],
    ephemeral: true
} as Discord.InteractionReplyOptions)