import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { Footer } from '@/modules/@shared/utils/footer';
import { CreateKeyModel } from '@/modules/generator/keys/models/CreateKey.model';
import { KeyGeneratedModel } from '@/modules/generator/keys/models/KeyGenerated.model';
import Discord, { Client, Interaction } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client,
    keys_generated: KeyGeneratedModel[],
    daysToExpire: number,
    quantityPerDay: number,
    service: CreateKeyModel["service"]
}

const KeyGeneratedMessage = (props: Props) => ({
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setAuthor({ name: `${props.interaction.guild?.name}`, iconURL: props.interaction.guild?.iconURL()! })
            .setDescription(`> ${emojis.success} Parabens, Suas keys do gerador foram geradas com sucesso!, agora basta resgatar no aplicativo!`)
            .addFields(
                {
                    name: `🔑 Keys geradas:`,
                    value: `\`\`\`${props.keys_generated.map(key => key.key).join('\n')}\`\`\``
                },
                {
                    name: `${emojis.add} Validade:`,
                    value: `\`\`\`${props.daysToExpire} dia para expirar (após resgatar)\`\`\``
                },
                {
                    name: `${emojis.money} Quantidade para gerar:`,
                    value: `\`\`\`${props.quantityPerDay} por dia\`\`\``
                },
                {
                    name: `${emojis.annoucement} Serviços:`,
                    value: `\`\`\`${props.service}\`\`\``
                },
                {
                    name: `${emojis.date} Data de criação:`,
                    value: `<t:${Math.floor(new Date().getTime() / 1000)}:f> \`(\`<t:${Math.floor(new Date().getTime() / 1000)}:R>\`)\``
                }
            )
            .setFooter({ ...Footer({ guild: props.interaction.guild! }) })
    ]
})

export { KeyGeneratedMessage }