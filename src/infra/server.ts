import client from "./app/app";
import Discord from 'discord.js'
import "dotenv/config"
import fg from "fast-glob"

const setupConsumers = () => {
    if (process.env.TS_NODE_DEV) {
        fg.sync("**/src/modules/**/**.consumer.ts")
            .map(async file => { (await import(`../../${file}`)) })
    } else {
        fg.sync("**/dist/modules/**/**.consumer.js")
            .map(async file => { (await import(`../../${file}`)) })
    }

}

type ActivitiesProps = {
    content: string,
    type: Exclude<Discord.ActivityType, Discord.ActivityType.Custom>,
    time: number
}

const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

client.on("ready", async () => {

    setupConsumers()
    console.log("✅ Bot is ready!")

    const activities: ActivitiesProps[] = [
        {
            content: '🛒 Hyper Store',
            type: Discord.ActivityType.Playing,
            time: 3000
        },
        {
            content: '💻 Qualidade e segurança',
            type: Discord.ActivityType.Watching,
            time: 5000
        },
        {
            content: '😍 Adquira ja o seu bot, site ou aplicativo',
            type: Discord.ActivityType.Watching,
            time: 5000
        },
        {
            content: '💸 Compre agora com a Hyper Store',
            type: Discord.ActivityType.Playing,
            time: 5000
        }
    ]

    while (true) {
        for (const activity of activities) {
            client.user?.setActivity({
                name: activity.content,
                type: activity.type
            })

            await sleep(activity.time);
        }
    }
})

process.setMaxListeners(0);