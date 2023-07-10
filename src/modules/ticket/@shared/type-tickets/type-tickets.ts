import { emojis } from "@/modules/@shared/utils/emojis";

type TypeTicketType = {
    id: string,
    emoji_custom: string,
    emoji: string,
    title: string,
    description: string
}

export const TypeTicket: TypeTicketType[] = [
    {
        id: "buy",
        emoji_custom: emojis.money,
        emoji: "💸",
        title: "Compra",
        description: "Realize uma compra de um produto"
    },
    {
        id: "budget",
        emoji_custom: "📦",
        emoji: "📦",
        title: "Orçamento",
        description: "Realize um orçamento de um site ou bot personalizado"
    },
    {
        id: "doubt",
        emoji_custom: "💡",
        emoji: "💡",
        title: "Dúvida",
        description: "Tirar dúvida sobre um produto"
    }
]