import { JsonDatabase } from "wio.db";

export class DatabaseConfig {
    constructor(
        public db = new JsonDatabase({
            databasePath: "config.json"
        })
    ) { }

    public get(key: string) {
        return this.db.get(key)
    }

    public set(key: string, value: Object) {
        return this.db.set(key, value);
    }

    public add(key: string, value: Object) {
        return this.db.add(key, value);
    }
}