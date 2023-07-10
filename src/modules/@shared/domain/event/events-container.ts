import { BaseEvent } from "./base-event"



export class EventsContainer {

    events: BaseEvent[] = []

    constructor() { }

    addEvent(event: BaseEvent): void {
        this.events.push(event)
    }

    getEvents(): BaseEvent[] {
        return this.events
    }

}

export namespace EventsContainer {

}