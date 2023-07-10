import { DatabaseConfig } from "@/infra/app/setup-config";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import Discord, { Interaction } from "discord.js";

export const ProductNotExist = (interaction: Interaction): Discord.InteractionReplyOptions => {
    return {
        content: `${interaction.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.error!)
                .setDescription(`> ${emojis.error} Este produto não existe mais, ou está indisponível no momento!`)
        ],
        ephemeral: true
    }
}