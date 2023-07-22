import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { Footer } from '@/modules/@shared/utils/footer';
import { KeyModel } from '@/modules/redeemkey/models/Key.model';
import Discord, { Client, Interaction } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client,
    keys_generated: KeyModel[]
}

const KeyCreatedMessage = (props: Props) => ({
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setAuthor({ name: `${props.interaction.guild?.name}`, iconURL: props.interaction.guild?.iconURL()! })
            .setDescription(`> ${emojis.success} Parabens, Sua key foi gerada com sucesso!, agora so basta utilizar o comando para resgata-la.`)
            .addFields(
                {
                    name: `🔑 Key gerada, value:`,
                    value: `\`\`\`${props.keys_generated.map(key => key.id).join('\n')}\`\`\``
                },
                {
                    name: `${emojis.date} Data de criação`,
                    value: `<t:${Math.floor(new Date().getTime() / 1000)}:f> \`(\`<t:${Math.floor(new Date().getTime() / 1000)}:R>\`)\``
                }
            )
            .setFooter({ ...Footer({ guild: props.interaction.guild! }) })
    ]
})

export { KeyCreatedMessage }