import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { ProductNotFoundMessage } from "@/modules/product/@shared/messages/product-not-found/product-not-found.message";

class ChangeProductDetailsEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith("change-product-details")) return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ client, interaction, permission: 'Administrador' }) })
            return;
        }

        const [_, product_id] = interaction.customId.split('_')

        const product = await ProductRepository.findById(product_id);

        if (!product) {
            interaction.update({ ...ProductNotFoundMessage({ client, interaction }) })
        }

        const modal = new Discord.ModalBuilder()
            .setCustomId(interaction.customId)
            .setTitle("Editar detalhes produto")

        const title = new Discord.TextInputBuilder()
            .setCustomId("title")
            .setLabel("Título do produto")
            .setPlaceholder('Example')
            .setMinLength(2)
            .setRequired(true)
            .setStyle(1)
            .setValue(product?.title!)

        const description = new Discord.TextInputBuilder()
            .setCustomId("description")
            .setLabel("Descrição do produto")
            .setPlaceholder('Example')
            .setMinLength(5)
            .setRequired(true)
            .setStyle(2)
            .setValue(product?.description!)

        const image = new Discord.TextInputBuilder()
            .setCustomId("image")
            .setLabel("Imagem do produto")
            .setPlaceholder('https://imgur.com/1237138')
            .setMinLength(5)
            .setRequired(false)
            .setStyle(1)
            .setValue(product?.image ?? "")

        const price = new Discord.TextInputBuilder()
            .setCustomId("price")
            .setLabel("Preço do produto")
            .setPlaceholder('2,00')
            .setMinLength(1)
            .setRequired(true)
            .setStyle(1)
            .setValue(product?.price.toFixed(2).toString()!)

        const youtubeURL = new Discord.TextInputBuilder()
            .setCustomId("youtube-url")
            .setLabel("Vídeo no youtube")
            .setPlaceholder('youtube.com/@hyperstore')
            .setMinLength(1)
            .setRequired(false)
            .setStyle(1)
            .setValue(product?.youtubeURL!)

        modal.addComponents(
            new Discord.ActionRowBuilder<any>().addComponents(title),
            new Discord.ActionRowBuilder<any>().addComponents(description),
            new Discord.ActionRowBuilder<any>().addComponents(image),
            new Discord.ActionRowBuilder<any>().addComponents(price),
            new Discord.ActionRowBuilder<any>().addComponents(youtubeURL),
        )

        interaction.showModal(modal);
        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ChangeProductDetailsEvent()
    buttonClickedEvent.setupConsumer(client)
}