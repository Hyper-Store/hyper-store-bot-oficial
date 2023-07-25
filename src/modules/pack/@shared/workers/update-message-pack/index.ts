import Discord from "discord.js"
import { PackPanelMessage, PackPanelMessageProps } from "../../messages/pack-panel.message";
import { PackRepository } from "@/modules/pack/repositories/Pack.repository";

export const UpdateMessagePack = async (props: PackPanelMessageProps): Promise<void> => {
    const pack = await PackRepository.findById(props.packId);

    const channel = props.interaction.guild?.channels.cache.get(pack?.channelId!);
    if (channel?.type !== Discord.ChannelType.GuildText) return;

    const message = channel?.messages.cache.get(pack?.messageId!);

    if (!channel || !message) {
        delete pack?.messageId
        delete pack?.channelId
        PackRepository.update({ ...pack! })
        return;
    }

    message.edit(await PackPanelMessage({ ...props }));
}