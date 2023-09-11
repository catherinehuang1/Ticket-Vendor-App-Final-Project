
// Author: Seth Franklin (GitHub ID: SethFranklin)

import React from "react";

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
    seat: Seat,
    seats_selected: SeatSelected[],
    set_seats_selected: React.Dispatch<React.SetStateAction<SeatSelected[]>>
}

const SeatButton = function({ seat, seats_selected, set_seats_selected }: Props) {
    const { row, column, status } = seat;
    let button_element;
    if (status === "open") {
        const filtered_seats_selected = seats_selected.filter(seat_selected => seat_selected.row === row && seat_selected.column === column);
        if (filtered_seats_selected.length === 0) {
            function button_clicked() {
                set_seats_selected(old_seats_selected => [...old_seats_selected, {row, column}]);
            }
            button_element = <button className="btn btn-primary" onClick={button_clicked}>
                <ul>
                    <li>Row: {row}</li>
                    <li>Column: {column}</li>
                    <li>Status: {status}</li>
                </ul>
            </button>;
        } else {
            function button_clicked() {
                set_seats_selected(old_seats_selected => old_seats_selected.filter(seat_selected => seat_selected.row !== row || seat_selected.column !== column));
            }
            button_element = <button className="btn btn-danger" onClick={button_clicked}>
                <ul>
                    <li>Row: {row}</li>
                    <li>Column: {column}</li>
                    <li>Status: {status}</li>
                </ul>
            </button>;
        }
    } else if (status === "processing") {
        button_element = <button className="btn btn-secondary" disabled>
            <ul>
                <li>Row: {row}</li>
                <li>Column: {column}</li>
                <li>Status: {status}</li>
            </ul>
        </button>;
    } else if (status === "sold") {
        button_element = <button className="btn btn-dark" disabled>
            <ul>
                <li>Row: {row}</li>
                <li>Column: {column}</li>
                <li>Status: {status}</li>
            </ul>
        </button>;
    }
    return button_element as JSX.Element;
};

export default SeatButton;