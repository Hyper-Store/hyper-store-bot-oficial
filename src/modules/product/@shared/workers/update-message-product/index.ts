import { Database } from "@/infra/app/setup-database"
import Discord, { Interaction } from "discord.js"
import { ProductMessage } from "../../messages/product-message/product-message";
import { ProductRepository } from "@/modules/product/repositories/product.repository";

export const UpdateMessageProduct = async (interaction: Interaction, productId: string): Promise<void> => {
    const product = await ProductRepository.findById(productId);

    const channel = interaction.guild?.channels.cache.get(product?.channelId!);
    if (channel?.type !== Discord.ChannelType.GuildText) return;

    const message = channel?.messages.cache.get(product?.messageId!);

    if (!channel || !message) {
        delete product?.messageId
        delete product?.channelId
        new Database().set(`purchases.products.${productId}`, product!);
        return;
    }

    message.edit(await ProductMessage(interaction, product!));
}