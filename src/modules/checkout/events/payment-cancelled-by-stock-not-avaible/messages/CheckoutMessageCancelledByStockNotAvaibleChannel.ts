import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client } from 'discord.js';

type Props = {
    client: Client,
    user: Discord.GuildMember
}

export const CheckoutMessageCancelledByStockNotAvaibleChannel = async (props: Props) => {
    return {
        content: `${props.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.error!)
                .setDescription(`> ${emojis.error} Houve um erro durante sua compra, consulte seu privado para mais informações!`)
        ]
    }
}