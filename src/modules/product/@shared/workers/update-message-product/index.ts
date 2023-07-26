import Discord, { Client, Guild, Interaction } from "discord.js"
import { ProductMessage } from "../../messages/product-message/product-message";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { ProductGroupRepository } from "@/modules/product-group/repositories/product-group.repository";
import { UpdateMessageProductGroup } from "@/modules/product-group/@shared/workers/update-message-product-group";

type Props = {
    guild: Guild,
    client: Client,
    productId: string
}

export const UpdateMessageProduct = async (props: Props): Promise<void> => {
    const product = await ProductRepository.findById(props.productId);

    const group = await ProductGroupRepository.checkProductIsInGroup(product?.id!);
    if (group) UpdateMessageProductGroup({ ...props, groupId: group.id! })

    const channel = props.guild.channels.cache.get(product?.channelId!);
    if (channel?.type !== Discord.ChannelType.GuildText) return;


    const message = channel?.messages.cache.get(product?.messageId!);

    if (!channel || !message) {
        delete product?.messageId
        delete product?.channelId
        ProductRepository.update({ ...product! })
        return;
    }

    message.edit(await ProductMessage({ ...props, product: product! }));
}