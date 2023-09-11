interface UserConfirmed {
    user_id:string,
    full_name:string,
    email_address:string
}

interface UserCreated {
    user_id:string,
    full_name:string,
    email_address:string
}

interface Seat {
    row:integer,
    column:integer
}

interface SeatsSelected extends Seat{
    user_id:string
    seats:Seat[]
}

interface TimeExpired {
    user_id:string
}

interface CardCreated {
    user_id:string,
    card_number:string,
    billing_address:string,
    expiration_date:string,
    cvv:string
}

interface CardAccepted {
    user_id:string
}

interface CardDenied {
    user_id:string
}

interface Card {
    card_number:string,
    billing_address:string,
    expiration_date:string,
    cvv:string
}

interface OrderConfirmed extends Seat{
    user_id:string,
    full_name:string,
    email_address:string,
    order_status:string,
    seats:Seat[],
    card_info:Card
}

export {
    UserConfirmed,
    UserCreated,
    SeatsSelected,
    TimeExpired,
    CardCreated,
    CardAccepted,
    CardDenied,
    OrderConfirmed
}