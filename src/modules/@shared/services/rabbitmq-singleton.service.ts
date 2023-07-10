import { RabbitmqServerProvider } from "../providers"
import "dotenv/config"

export class RabbitmqSingletonService {

    static rabbitmqServerProvider: RabbitmqServerProvider

    static async getInstance(): Promise<RabbitmqServerProvider> {
        const rabbitmqServerProvider = new RabbitmqServerProvider(process.env.RABBITMQ_LOGIN_CREDENTIALS!)
        await rabbitmqServerProvider.start()
        return rabbitmqServerProvider
    }
}