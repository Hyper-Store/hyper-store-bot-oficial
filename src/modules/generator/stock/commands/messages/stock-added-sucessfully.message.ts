import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { CreateKeyModel } from "@/modules/generator/keys/models/CreateKey.model";
import { ProductModel } from "@/modules/product/models/product.model";
import Discord, { Client, Interaction, InteractionUpdateOptions } from "discord.js";

type Props = {
    interaction: Interaction,
    client: Client,
    stock_collector: string[],
    service: CreateKeyModel["service"]
}

export const GeneratorStockAddedSuccessfullyMessage = (props: Props): InteractionUpdateOptions => {
    return {
        content: `${props.interaction.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} Estoque adicionado ao produto com sucesso, veja abaixo o estoque adicionado!\n\`\`\`${props.stock_collector.join(' \n')}\`\`\`\n**${emojis.box} | Serviço:** ${props.service}`)
        ]
    }
}