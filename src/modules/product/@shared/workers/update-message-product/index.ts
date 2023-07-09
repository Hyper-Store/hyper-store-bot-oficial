import { Database } from "@/infra/app/setup-database"
import { ProductType } from "@/modules/purchases/@types/Product.type";
import Discord, { Interaction } from "discord.js"
import { ProductMessage } from "../../messages/product-message/product-message";

export const UpdateMessageProduct = async (interaction: Interaction, productId: string): Promise<void> => {
    const db_product: ProductType | undefined = await new Database().get(`purchases.products.${productId}`) as ProductType;

    const channel = interaction.guild?.channels.cache.get(db_product.channelId!);
    if (channel?.type !== Discord.ChannelType.GuildText) return;

    const message = channel?.messages.cache.get(db_product.messageId!);

    if (!channel || !message) {
        delete db_product.messageId
        delete db_product.channelId
        new Database().set(`purchases.products.${productId}`, db_product);
        return;
    }

    message.edit(await ProductMessage(interaction, db_product));
}