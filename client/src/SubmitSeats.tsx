
// Author: Seth Franklin (GitHub ID: SethFranklin)

import React from "react";
import axios from "axios";

interface Seat {
    row: number,
    column: number,
    status: string
}

interface SeatSelected {
    row: number,
    column: number
}

interface Props {
    seats_selected: SeatSelected[],
    set_seats_selected: React.Dispatch<React.SetStateAction<SeatSelected[]>>
    set_seats: React.Dispatch<React.SetStateAction<Seat[]>>
}

const SubmitSeats = function({ seats_selected, set_seats_selected, set_seats }: Props) {
    if (seats_selected.length > 0) {
        async function button_clicked() {
            const user_id = localStorage.getItem("user_id");
            if (user_id !== null) {
                const response = await axios.post("http://localhost:4002/api/v1/seats", {
                    user_id,
                    seats: seats_selected
                });
                if (response.status === 200) {
                    const TIMER_DURATION = 60000;
                    localStorage.setItem("expiration_timestamp", (Date.now() + TIMER_DURATION).toString());
                    window.location.href = "/card";
                } else {
                    set_seats_selected(old_seats_selected => []);
                    set_seats(old_seats => []);
                }
            }
        }
        return <button className="btn btn-success" onClick={button_clicked}>Submit seats selected</button>
    } else {
        return <button className="btn btn-secondary" disabled>Submit seats selected</button>
    }
};

export default SubmitSeats;