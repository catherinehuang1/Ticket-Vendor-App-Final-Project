
// Author: Seth Franklin (GitHub ID: SethFranklin)

import React, { useState } from "react";
import axios from "axios";

interface Seat {
    row: number,
    column: number
}

interface Card {
    card_number: string,
    billing_address: string,
    expiration_date: string,
    cvv: string
}

interface Order {
    user_id: string,
    full_name: string,
    email_address: string,
    order_status: string,
    seats: Seat[] | null,
    card_info: Card | null
}

const Order = function() {
    const [element, set_element] = useState<JSX.Element | undefined>(undefined);
    const user_id = localStorage.getItem("user_id");
    if (element === undefined) {
        try {
            axios.get("http://localhost:4004/api/v1/orders/confirm/" + user_id).then(function(response) {
                if (response.status === 200) {
                    const order = response.data as Order;
                    const { user_id, full_name, email_address, order_status, seats, card_info } = order;
                    if (order_status === "processing_card") {
                        set_element(old_element => (
                            <div>
                                <h3>Hi {full_name}, your order and credit card is still processing.</h3>
                                <p>Please refresh this page for updates.</p>
                            </div>
                        ));
                    } else if (order_status === "timed_out") {
                        set_element(old_element => (
                            <div>
                                <h3>Sorry {full_name}, you didn't enter in your credit card fast enough in the time window.</h3>
                                <p>Your seats have been given up as a result of this.</p>
                            </div>
                        ));
                    } else if (order_status === "denied") {
                        set_element(old_element => (
                            <div>
                                <h3>Sorry {full_name}, your credit card has been denied.</h3>
                                <p>Your seats have been given up as a result of this.</p>
                            </div>
                        ));
                    } else if (order_status === "accepted") {
                        const { card_number, billing_address, expiration_date, cvv } = card_info as Card;
                        set_element(old_element => (
                            <div>
                                <h3>Congrats {full_name}, you have successfully bought tickets to the concert!</h3>
                                <p>You will recieve email confirmation at about your tickets at the address: {email_address}.</p>
                                <p>Here are the tickets you bought:</p>
                                <ul>
                                    {seats?.map(seat => <li>Row: {seat.row}, Column: {seat.column}</li>)}
                                </ul>
                            </div>
                        ));
                    } else {
                        set_element(old_element => <h3>User doesn't exist.</h3>);
                    }
                } else {
                }
            });
        } catch (err) {
            set_element(old_element => <h3>User doesn't exist.</h3>);
        }
        return <h3>User doesn't exist.</h3>;
    }
    return element;
};

export default Order;