import Discord, { Client, Interaction } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client,
    support_role: string
}

const HasPermissionTeam = (props: Props) => {
    if (props.interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) return true;
    if ((props.interaction.member?.roles as Discord.GuildMemberRoleManager).cache.get(props.support_role)) return true;
    return false;
}

export { HasPermissionTeam }