
// Author: Seth Franklin (GitHub ID: SethFranklin)

import React from "react";

import SeatButton from "./SeatButton"

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
    seats: Seat[]
    seats_selected: SeatSelected[],
    set_seats_selected: React.Dispatch<React.SetStateAction<SeatSelected[]>>
}

const Grid = function({ seats, seats_selected, set_seats_selected }: Props) {

    if (seats.length > 0) {

        const min_row: number = seats.reduce((acc, val) => ((acc === undefined || val.row < acc.row) ? val : acc), seats[0]).row;
        const max_row: number = seats.reduce((acc, val) => ((acc === undefined || val.row > acc.row) ? val : acc), seats[0]).row;

        const min_column: number = seats.reduce((acc, val) => ((acc === undefined || val.column < acc.column) ? val : acc), seats[0]).column;
        const max_column: number = seats.reduce((acc, val) => ((acc === undefined || val.column > acc.column) ? val : acc), seats[0]).column;

        const num_rows: number = max_row - min_row + 1;
        const num_cols: number = max_column - min_column + 1;

        const grid_items = [];

        for (let row = min_row; row <= max_row; row++) {
            for (let column = min_column; column <= max_column; column++) {
                let grid_item;
                const filtered_seats = seats.filter(seat => seat.row === row && seat.column === column);
                const seat_key = row + "," + column;
                if (filtered_seats.length > 0) {
                    const seat = filtered_seats[0];
                    grid_item = <div className="grid-item" key={seat_key}><SeatButton seat={seat} seats_selected={seats_selected} set_seats_selected={set_seats_selected} /></div>
                } else {
                    grid_item = <div className="grid-item" key={seat_key}>Empty</div>
                }
                grid_items.push(grid_item);
            }
        }

        const grid_style = {
            display: "grid",
            gridTemplateColumns: Array(num_cols).fill("auto").join(" ")
        };

        return (
            <div className="grid-container" style={grid_style}>{grid_items}</div>
        );

    } else {
        return <div className="grid-container"></div>;
    }
};

export default Grid;