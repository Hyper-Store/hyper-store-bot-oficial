import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { ProductRepository } from "../../repositories/product.repository";
import { ProductStockRepository } from "../../repositories/product-stock.repository";

class SetProductPurchasesCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "setproduct",
            description: "Setar algum produto a este canal",
            type: Discord.ApplicationCommandType.ChatInput
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const products = await ProductRepository.getAll();

        if (products.length < 1) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.invisible!)
                        .setDescription(`> ${emojis.error} Não tem nenhum produto cadastrado no sistema para adiciona-lô a um canal!`)
                ],
                ephemeral: true
            })
            return;
        }

        const list_product: Discord.SelectMenuComponentOptionData[] = [];

        for (const product of Object.keys(products)) {
            const product_index = product as any
            const stockCount = await ProductStockRepository.stockCount(products[product_index].id!);

            list_product.push({
                emoji: "📦",
                label: `${products[product_index].title} - ID: (${products[product_index].id?.slice(0, 8)})`,
                description: `💸 R$${products[product_index].price.toFixed(2)} - 🎁 ${stockCount} Estoque`,
                value: products[product_index].id!,
            })
        }

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} Para adicionar um novo produto clique ao botão abaixo para continuar!`)
            ],
            components: [
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId('set_product')
                            .setPlaceholder('⏩ Escolha uma opção')
                            .setOptions(list_product)
                    ),
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('back')
                            .setLabel('Voltar')
                            .setEmoji('↩')
                            .setDisabled(true)
                            .setStyle(1)
                    )
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Próximo')
                            .setEmoji('↪')
                            .setDisabled(products.length <= 25)
                            .setStyle(1)
                    )
            ],
            ephemeral: true
        })

        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new SetProductPurchasesCommand()
    commandContainer.addCommand(command)
}