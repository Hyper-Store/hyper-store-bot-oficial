import { JsonDatabase } from "wio.db";

export class Database {
    constructor(
        public db = new JsonDatabase({
            databasePath: "src/infra/database/db.json"
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

    public push(key: string, value: Object) {
        return this.db.push(key, value);
    }

    public delete(key: string) {
        return this.db.delete(key);
    }
}