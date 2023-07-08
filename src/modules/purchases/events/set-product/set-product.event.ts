import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { ProductMessage } from "../../@shared/messages/product-message/product-message";
import { Database } from "@/infra/app/setup-database";
import { ProductType } from "../../@types/Product.type";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { ProductNotExistError } from "../../@shared/errors/product-not-exist";


class SetProductPurchasesEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "set_product") return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const product_id = interaction.values[0];
        const product = await new Database().get(`purchases.products.${product_id}`) as ProductType

        if (!product) {
            interaction.reply({ ...ProductNotExistError })
            return;
        }

        const message_created = await interaction.channel?.send(await ProductMessage(interaction, product as ProductType))

        await new Database().set(`purchases.products.${product_id}`, { ...product, channelId: message_created?.channelId, messageId: message_created?.id })

        interaction.update({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} Produto setado ao canal com sucesso!`)
            ],
            components: []
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new SetProductPurchasesEvent()
    buttonClickedEvent.setupConsumer(client)
}