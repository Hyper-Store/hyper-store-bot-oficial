import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { KeyModel } from '@/modules/redeemkey/models/Key.model';
import Discord, { Interaction } from 'discord.js';

type Props = {
    interaction: Interaction,
    key: KeyModel
}

export const KeyRescueRoleSuccessMessage = (props: Props) => {
    return {
        content: `${props.interaction.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} Você resgatou a key com sucesso, e recebeu o cargo: \`${props.interaction.guild?.roles.cache.get(props.key.content)?.name}\`!`)
        ],
        ephemeral: true
    }
}