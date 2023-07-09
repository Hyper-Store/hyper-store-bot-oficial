import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { Interaction, } from "discord.js";
import Discord, { Client } from "discord.js"
import { ProductRepository } from "../../repositories/product.repository";


class ModalSubmitedAddProductEvent extends BaseEvent {
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

        const product = await ProductRepository.create({
            title,
            description,
            price,
            image: image || ""
        })

        await interaction.deferUpdate();

        interaction.editReply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} Seu produto \`${title}\` foi criado com sucesso, o **ID° Protocolo** é \`${product.id}\``)
            ],
            components: []
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ModalSubmitedAddProductEvent()
    buttonClickedEvent.setupConsumer(client)
}