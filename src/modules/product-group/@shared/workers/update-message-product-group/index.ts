import { Database } from "@/infra/app/setup-database"
import Discord, { Client, Interaction } from "discord.js"
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { GroupPanelMessage, GroupPanelMessageProps } from "../../messages/group-panel/group-panel.message";
import { ProductGroupRepository } from "@/modules/product-group/repositories/product-group.repository";

export const UpdateMessageProductGroup = async (props: GroupPanelMessageProps): Promise<void> => {
    const group = await ProductGroupRepository.findById(props.groupId);

    const channel = props.interaction.guild?.channels.cache.get(group?.channelId!);
    if (channel?.type !== Discord.ChannelType.GuildText) return;

    const message = channel?.messages.cache.get(group?.messageId!);

    if (!channel || !message) {
        delete group?.messageId
        delete group?.channelId
        ProductGroupRepository.update({ ...group! })
        return;
    }

    message.edit(await GroupPanelMessage({ ...props }));
}