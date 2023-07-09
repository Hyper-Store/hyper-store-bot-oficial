import { Database } from "@/infra/app/setup-database";
import Discord, { Interaction } from "discord.js";
import { colors } from "@/modules/@shared/utils/colors";
import { DatabaseConfig } from "@/infra/app/setup-config";
import { emojis } from "@/modules/@shared/utils/emojis";
import { CheckoutRepository } from "@/modules/checkout/repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";

export const ResumeMessage = async (interaction: Interaction) => {

    const checkout = await CheckoutRepository.findById(interaction.channelId!);
    const product = await ProductRepository.findById(checkout?.productId!);

    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setTitle(`${interaction.guild?.name} | Resumo da compra`)
                .setDescription(`**${emojis.box} | Produto:** \`${product?.title}\`\n**${emojis.money} | Valor unitário:** \`R$${product?.price.toFixed(2)}\`\n**${emojis.buy} | Quantidade:** \`${checkout?.quantity}\`\n**${emojis.money} | Total:** \`R$${(product?.price! * checkout?.quantity!).toFixed(2)}\``)
                .setImage(new DatabaseConfig().get(`purchases.products.banner`) as string)
                .setFooter({ text: 'Selecione abaixo a quantidade que você deseja' })
        ],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('add-quantity')
                        .setEmoji(emojis.add)
                        .setStyle(3)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('remove-quantity')
                        .setEmoji(emojis.remove)
                        .setStyle(4)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('go-method-payment')
                        .setEmoji(emojis.accept)
                        .setLabel('Ir para pagamento')
                        .setStyle(1)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('cancel-cart')
                        .setEmoji(emojis.notaccept)
                        .setLabel('Cancelar')
                        .setStyle(4)
                )
        ]
    }
}