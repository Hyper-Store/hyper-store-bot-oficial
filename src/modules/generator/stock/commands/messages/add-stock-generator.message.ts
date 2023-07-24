import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { CreateKeyModel } from "@/modules/generator/keys/models/CreateKey.model";
import Discord, { Client, Interaction, InteractionReplyOptions } from "discord.js";

type Props = {
    interaction: Interaction,
    client: Client,
    service: CreateKeyModel["service"]
}

export const AddStockGeneratorMessage = (props: Props): InteractionReplyOptions => {
    return {
        content: `${props.interaction.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.notifiy} Agora envie o estoque por linha, cada linha ou mensagem será um estoque, digite finalizar para finalizar!\n\n**${emojis.box} | Serviço:** \`${props.service}\``)
        ],
        components: [],
        ephemeral: true
    }
}