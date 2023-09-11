
import {
    EventBusConnection,
    EventType,
    EventData,
    SeatsSelected,
    CardAccepted,
    CardDenied
} from "./events.js";

import TimersDatabase from "./db.js";

const EXPIRE_INTERVAL: number = 1000;
const TIMER_DURATION: number = 60000;

const db: TimersDatabase = new TimersDatabase();
await db.connect();

const event_bus: EventBusConnection = new EventBusConnection("timers");

const event_types: EventType[] = [
    EventType.SEATS_SELECTED,
    EventType.CARD_ACCEPTED,
    EventType.CARD_DENIED
];

await event_bus.listen(event_types, async function(event_type: EventType, event_data: EventData) {
    if (event_type === EventType.SEATS_SELECTED) {
        const seats_selected: SeatsSelected = event_data as SeatsSelected;
        const { user_id } = seats_selected;
        await db.create_timer(user_id, TIMER_DURATION);
    } else if (event_type === EventType.CARD_ACCEPTED) {
        const card_accepted: CardAccepted = event_data as CardAccepted;
        const { user_id } = card_accepted;
        await db.delete_timer(user_id);
    } else if (event_type === EventType.CARD_DENIED) {
        const card_denied: CardDenied = event_data as CardDenied;
        const { user_id } = card_denied;
        await db.delete_timer(user_id);
    }
});

setInterval(async function() {
    const expired_timers = await db.expire_timers();
    for (const expired_timer of expired_timers) {
        await event_bus.emit(EventType.TIMER_EXPIRED, {
            user_id: expired_timer.user_id
        });
    }
}, EXPIRE_INTERVAL);
