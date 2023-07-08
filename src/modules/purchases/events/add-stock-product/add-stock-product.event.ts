import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { Interaction, Message } from "discord.js";
import Discord, { Client } from "discord.js"
import { Database } from "@/infra/app/setup-database";
import { ProductType } from "../../@types/Product.type";
import { ProductNotExistError } from "../../@shared/errors/product-not-exist";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { randomUUID } from "crypto";


class AddStockProductPurchasesEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "add_stock_product") return;
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

        interaction.update({
            content: `${interaction.user}`,
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.notifiy} Agora envie o estoque por linha, cada linha ou mensagem será um estoque, digite finalizar para finalizar!\n\n**${emojis.box} | Produto:** ${product.title} \`(\`${product.id}\`)\``)
            ],
            components: []
        })
        const stock_collector: string[] = [];

        const collectorFilter = (m: Message) => m.author.id === interaction.user.id
        const collector = interaction.channel?.createMessageCollector({ filter: collectorFilter });

        collector?.on('collect', (message) => {
            message.delete();

            if (message.content === "finalizar") return collector.stop();
            message.content.split('\n').forEach(m => {
                stock_collector.push(m);
            })
        })

        collector?.on('end', (message) => {
            stock_collector.forEach(async (item) => {
                await new Database().push(`purchases.products.${product_id}.stock`, {
                    id: randomUUID(),
                    content: item
                })
            })

            interaction.editReply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.invisible!)
                        .setDescription(`> ${emojis.success} Estoque adicionado ao produto com sucesso, veja abaixo o estoque adicionado!\n\`\`\`${stock_collector.join('\n')}\`\`\`\n**${emojis.box} | Produto:** ${product.title} \`(\`${product.id}\`)\``)
                ]
            })
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new AddStockProductPurchasesEvent()
    buttonClickedEvent.setupConsumer(client)
}