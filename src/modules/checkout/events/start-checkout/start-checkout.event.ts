import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { DatabaseConfig } from "@/infra/app/setup-config";
import { randomUUID } from "crypto";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { ProductNotExist } from "../../@shared/_error/ProductNotExist.error";
import { NoStockProduct } from "../../@shared/_error/NoStockProduct.error";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { RabbitmqSingletonService } from "@/modules/@shared/services";


class StartCheckoutEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith('buy')) return;

        const [, product_id] = interaction.customId.split("_");

        const product = await ProductRepository.findById(product_id);

        if (!product) {
            interaction.reply({ ...ProductNotExist(interaction) })
            return;
        }

        if ((product.stock ?? []).length < 1) {
            interaction.reply({ ...await NoStockProduct(interaction) })
            return;
        }

        const channel_exist = interaction.guild?.channels.cache.find(c => c.name === `🛒・${interaction.user.username.toLowerCase().replace(/ /g, '-')}`);
        if (channel_exist) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.error!)
                        .setDescription(`> ${emojis.error} Você já possui um carrinho aberto em ${channel_exist}, finalize sua compra para continuar!`)
                ],
                components: [
                    new Discord.ActionRowBuilder<any>()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setLabel('Ir para carrinho')
                                .setEmoji('🛒')
                                .setStyle(5)
                                .setURL(channel_exist.url)
                        )
                ],
                ephemeral: true
            })
            return;
        }

        await interaction.reply({
            content: `${interaction.user}`,
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.loading} Seu carrinho está sendo aberto, aguarde...`)
            ],
            ephemeral: true
        })

        const channel_created = await interaction.guild?.channels.create({
            name: `🛒・${interaction.user.username}`,
            parent: await new DatabaseConfig().get(`reedemkey.category_id`) as string,
            permissionOverwrites: [
                {
                    id: interaction.guildId!,
                    deny: ["ViewChannel"]
                },
                {
                    id: interaction.user.id,
                    allow: ["ViewChannel", "ReadMessageHistory"],
                    deny: ["SendMessages", "AttachFiles", "AddReactions"]
                }
            ]
        })

        const channel_terms_of_services = interaction.guild?.channels.cache.get(await new DatabaseConfig().get(`reedemkey.channel_terms_of_services`) as string)

        await channel_created?.send({
            content: `||${interaction.user}||`,
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`📣 | Olá ${interaction.user}, este é seu carrinho, fique á vontade para escolher os produtos ou fazer modificações que achar nescessário.\n\n🚨 | Lembre-se de ler nossos termos de compra, para não ter nenhum problema futuramente, ao continuar com a compra, você concorda com nossos termos.\n\n🔔 | Quando estiver tudo pronto aperte o botão abaixo, para continuar com sua compra!`)
                    .setFooter({ text: `${interaction.guild?.name} | Todos os direitos reservados.` })
            ],
            components: [
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('accept-cart')
                            .setLabel('Aceitar e Continuar')
                            .setEmoji(emojis.accept)
                            .setStyle(3)
                    )
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('cancel-cart')
                            .setLabel('Cancelar')
                            .setEmoji(emojis.notaccept)
                            .setStyle(4)
                    )
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel('Ler os termos')
                            .setEmoji('📋')
                            .setURL(channel_terms_of_services?.url!)
                            .setStyle(5)
                    )
            ]
        })

        await CheckoutRepository.create({
            id: channel_created?.id!,
            ownerId: interaction.user.id,
            productId: product.id!
        })

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        rabbitmq.publishInQueue("checkoutTimeoutQueue", JSON.stringify({ checkoutId: channel_created?.id! }))


        interaction.editReply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} Carrinho aberto com sucesso em ${channel_created}`)
            ],
            components: [
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel('Ir para carrinho')
                            .setEmoji('🛒')
                            .setStyle(5)
                            .setURL(channel_created?.url!)
                    )
            ],
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new StartCheckoutEvent()
    buttonClickedEvent.setupConsumer(client)
}