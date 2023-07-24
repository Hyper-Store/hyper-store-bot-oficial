import { Database } from "@/infra/app/setup-database"
import Discord, { Interaction } from "discord.js"
import { ProductMessage } from "../../messages/product-message/product-message";
import { ProductRepository } from "@/modules/product/repositories/product.repository";

type Props = {
    interaction: Interaction,
    productId: string
}

export const UpdateMessageProduct = async (props: Props): Promise<void> => {
    const product = await ProductRepository.findById(props.productId);

    const channel = props.interaction.guild?.channels.cache.get(product?.channelId!);
    if (channel?.type !== Discord.ChannelType.GuildText) return;

    const message = channel?.messages.cache.get(product?.messageId!);

    if (!channel || !message) {
        delete product?.messageId
        delete product?.channelId
        new Database().set(`purchases.products.${props.productId}`, product!);
        return;
    }

    message.edit(await ProductMessage({ interaction: props.interaction, product: product! }));
}