import Discord, { Guild } from "discord.js";
import { emojis } from "./emojis";

type Props = {
    guild: Guild
}

export const Footer = (props: Props): Discord.EmbedFooterData => {
    return {
        text: `${emojis.oficial as string} © ${props.guild.name} ・ Todos os direitos reservados`
    }
}