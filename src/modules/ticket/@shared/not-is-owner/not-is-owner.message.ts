import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client
}

const NotIsOwnerMessage = (props: Props) => ({
    content: `||${props.interaction.user}||`,
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.error!)
            .setDescription(`> ${emojis.error} Você não é o dono deste ticket para utilizar esta função!`)
    ],
    ephemeral: true
})

export { NotIsOwnerMessage }