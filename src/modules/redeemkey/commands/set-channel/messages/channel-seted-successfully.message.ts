import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client
}

const ChannelSetedSuccessfullyMessage = (props: Props) => ({
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setDescription(`> ${emojis.success} Canal setado com sucesso para resgatar key!`)
    ],
    ephemeral: true
})

export { ChannelSetedSuccessfullyMessage }