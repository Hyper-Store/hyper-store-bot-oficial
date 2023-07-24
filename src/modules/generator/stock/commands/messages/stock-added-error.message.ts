import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { CreateKeyModel } from "@/modules/generator/keys/models/CreateKey.model";
import { ProductModel } from "@/modules/product/models/product.model";
import Discord, { Client, Interaction, InteractionUpdateOptions } from "discord.js";

type Props = {
    interaction: Interaction,
    client: Client,
    service: CreateKeyModel["service"]
}

export const GeneratorStockAddedErrorMessage = (props: Props): InteractionUpdateOptions => {
    return {
        content: `${props.interaction.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} Houve um erro no servidor ao tentar adicionar o estoque ao serviço: \`${props.service}\``)
        ]
    }
}