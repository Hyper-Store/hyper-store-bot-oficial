import { Connection, Channel, connect, Message, Options } from "amqplib";

export class RabbitmqServerProvider {
    private conn?: Connection;
    private channel?: Channel;

    constructor(private uri: string) { }

    async start(): Promise<void> {
        if (!this.conn || !this.channel) {
            this.conn = await connect(this.uri);
            this.channel = await this.conn.createChannel();
        }
    }

    async close(): Promise<void> {
        await this.channel?.close();
        await this.conn?.close();
    }

    async publishInQueue(queue: string, message: string) {
        return this.channel!.sendToQueue(queue, Buffer.from(message));
    }

    async bindQueue(queue: string, exchange: string, routingKey: string) {
        return this.channel!.bindQueue(queue, exchange, routingKey);
    }

    async assertExchange(exchange: string, type: string, options?: Options.AssertExchange) {
        return this.channel?.assertExchange(exchange, type, options);
    }

    async assertQueue(queue: string, options?: Options.AssertQueue) {
        return this.channel!.assertQueue(queue, options);
    }

    async publishInExchange(
        exchange: string,
        routingKey: string,
        message: string
    ): Promise<boolean> {
        return this.channel!.publish(exchange, routingKey, Buffer.from(message));
    }

    async consume(queue: string, callback: (message: Message, channel: Channel) => Promise<void | boolean>) {
        return await this.channel!.consume(queue, async (message) => {
            const result = await callback(message!, this.channel!);
            if (typeof result === "boolean") {
                if (!result) return this.channel!.nack(message!);
            }
            this.channel!.ack(message!);
        }, { noAck: false, });
    }
}