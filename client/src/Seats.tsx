
// Author: Seth Franklin (GitHub ID: SethFranklin)

import React, { useState } from "react";
import axios from "axios";

import Grid from "./Grid";
import SubmitSeats from "./SubmitSeats";

interface Seat {
    row: number,
    column: number,
    status: string
}

interface SeatSelected {
    row: number,
    column: number
}

const Seats = function() {

    const [seats_selected, set_seats_selected] = useState<SeatSelected[]>([]);

    const [seats, set_seats] = useState<Seat[]>([]);

    if (seats.length === 0) {
        const user_id = localStorage.getItem("user_id");

        axios.get("http://localhost:4002/api/v1/seats/" + user_id).then(function(response) {
            if (response.status === 200) {
                set_seats(old_seats => [...old_seats, ...response.data]);
            } else {
                set_seats(old_seats => []);
            }
        });
    }

    let num_selected_string = "1 seat selected";
    if (seats_selected.length !== 1) {
        num_selected_string = `${seats_selected.length} seats selected`;
    }

    return (
        <div>
            <SubmitSeats seats_selected={seats_selected} set_seats_selected={set_seats_selected} set_seats={set_seats} />
            <div>{num_selected_string}</div>
            <Grid seats={seats} seats_selected={seats_selected} set_seats_selected={set_seats_selected} />
        </div>
    );
};

export default Seats;