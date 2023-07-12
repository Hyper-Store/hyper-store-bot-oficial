import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { PackModel } from '@/modules/pack/models/Pack.model';
import Discord, { Interaction } from 'discord.js';

type Props = {
    interaction: Interaction
    pack: PackModel
}

export const PackCreatedSuccessfully = (props: Props): Discord.InteractionReplyOptions => {
    return {
        content: `||${props.interaction.user}||`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} Parabéns, seu pack \`${props.pack.title}\` criado com sucesso!`)
        ],
        ephemeral: true
    }
}