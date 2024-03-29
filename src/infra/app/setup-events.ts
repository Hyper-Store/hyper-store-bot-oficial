import { BaseEvent, EventsContainer } from "@/modules/@shared/domain"
import fg from "fast-glob"
import Discord from "discord.js"

export const events = new Discord.Collection<string, BaseEvent>();
export const setupEvents = (client: any): void => {
    const eventsContainer = new EventsContainer()
    if (process.env.TS_NODE_DEV) {
        fg.sync("**/src/modules/**/**.event.ts")
            .map(async file => { (await import(`../../../${file}`)).default(client) })
    } else {
        fg.sync("**/dist/modules/**/**.event.js")
            .map(async file => { (await import(`../../../${file}`)).default(client) })
    }
}