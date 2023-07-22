import { colors } from '@/modules/@shared/utils/colors';
import Discord, { Channel, Client, Interaction, TextChannel } from 'discord.js';
import { emojis } from '../../utils/emojis';

type Props = {
    interaction: Interaction,
    client: Client,
    channelType: string
}

const ChannelNotIsOfTypeMessage = (props: Props) => ({
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.error!)
            .setDescription(`> ${emojis.error} O canal informado não é do tipo \`${props.channelType}\`, verifique e tente novamente!`)
    ]
})

export { ChannelNotIsOfTypeMessage }