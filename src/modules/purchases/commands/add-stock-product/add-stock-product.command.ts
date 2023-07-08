import { Database } from "@/infra/app/setup-database";
import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { ProductType } from "../../@types/Product.type";

class AddStockProductPurchasesCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "addstockproduct",
            description: "Adicionar estoque a algum produto",
            type: Discord.ApplicationCommandType.ChatInput
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const products: any = await new Database().get(`purchases.products`);

        if (!products) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.invisible!)
                        .setDescription(`> ${emojis.error} Não tem nenhum produto cadastrado no sistema para adiciona-lô a um canal!`)
                ]
            })
            return;
        }

        const list_product: any = [];

        Object.keys(products).forEach((product) => {
            list_product.push({
                emoji: "📦",
                label: `${products[product].title} - ID: (${products[product].id.slice(0, 8)})`,
                description: `💸 R$${products[product].price.toFixed(2)} - 🎁 ${products[product].stock.length} STOCK`,
                value: products[product].id,
            })
        })

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} Para adicionar o estoque escolha um produto logo abaixo!`)
            ],
            components: [
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId('add_stock_product')
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
    const command = new AddStockProductPurchasesCommand()
    commandContainer.addCommand(command)
}