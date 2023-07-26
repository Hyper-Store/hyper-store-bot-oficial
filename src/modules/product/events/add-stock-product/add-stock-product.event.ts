import { BaseEvent } from "@/modules/@shared/domain";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { Interaction, Message } from "discord.js";
import Discord, { Client } from "discord.js"
import { UpdateMessageProduct } from "../../@shared/workers/update-message-product";
import { ProductRepository } from "../../repositories/product.repository";
import { ProductStockRepository } from "../../repositories/product-stock.repository";
import { ProductNotFoundMessage } from "../../@shared/messages/product-not-found/product-not-found.message";
import { AddStockProductMessage } from "./messages/add-stock-product.message";
import { ProductStockAddedSuccessfullyMessage } from "./messages/stock-added-successfully.message";

class AddStockProductEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "add-stock-product") return;
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ client, interaction, permission: 'Administrador' }) })
            return;
        }

        const product = await ProductRepository.findById(interaction.values[0]);

        if (!product) {
            interaction.update({ ...ProductNotFoundMessage({ client, interaction }) })
        }

        interaction.update({ ...AddStockProductMessage({ client, interaction, product: product! }) })

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

        collector?.on('end', async (message) => {
            stock_collector.forEach(async (item) => {
                await ProductStockRepository.add(product?.id!, {
                    content: item
                })
            })

            await UpdateMessageProduct({
                guild: interaction.guild!, client, productId: product?.id!
            });

            interaction.editReply({ ...ProductStockAddedSuccessfullyMessage({ client, interaction, product: product!, stock_collector }) })
            return;
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new AddStockProductEvent()
    buttonClickedEvent.setupConsumer(client)
}