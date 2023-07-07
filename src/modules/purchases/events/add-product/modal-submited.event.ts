import { DatabaseConfig } from "@/infra/app/setup-config";
import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { randomUUID } from "crypto";
import { Interaction, Message, } from "discord.js";
import Discord, { Client } from "discord.js"
import { ProductType } from "../../@types/Product.type";


class ModalSubmitedAddProductPurchasesEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "add_product") return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description');
        const image = interaction.fields.getTextInputValue('image');
        let price: string | number = interaction.fields.getTextInputValue('price');

        price = parseFloat(price.replace('R$', '').replace(',', '.'));

        if (isNaN(price) || price < 1 || price > 1000) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.error!)
                        .setDescription(`> ${emojis.error} O valor inserido \`${price}\` deve ser maior que \`R$1,00\` ou menor que \`R$1000,00\`!`)
                ],
                ephemeral: true
            })
            return;
        }

        const uuid_generated = randomUUID();

        new Database().set(`purchases.products.${uuid_generated}`, {
            id: uuid_generated,
            title,
            description,
            price,
            stock: [],
            image: image || "",
            createdAt: new Date()
        } as ProductType)

        await interaction.deferUpdate();

        interaction.editReply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} Seu produto \`${title}\` foi criado com sucesso, o **ID° Protocolo** é \`${uuid_generated}\``)
            ],
            components: []
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ModalSubmitedAddProductPurchasesEvent()
    buttonClickedEvent.setupConsumer(client)
}