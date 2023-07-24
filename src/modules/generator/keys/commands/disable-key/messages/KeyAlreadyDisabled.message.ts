import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction, InteractionReplyOptions } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client
}

const KeyAlreadyDisabledMessage = (props: Props): InteractionReplyOptions => ({
    content: `||${props.interaction.user}||`,
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.error!)
            .setDescription(`> ${emojis.error} A key informada já foi desativada recentemente!`)
    ],
    ephemeral: true
})

export { KeyAlreadyDisabledMessage }