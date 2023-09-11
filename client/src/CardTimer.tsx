
// Author: Catherine Huang (GitHub ID: catherinehuang1)

import React from "react";
import Countdown from "react-countdown";

const CardTimer = function() {
    function timerWentOff() {
        window.location.href = "/order";
    }
    const expiration_timestamp = parseInt(localStorage.getItem("expiration_timestamp") as string);
    return <Countdown date={expiration_timestamp} onComplete={timerWentOff} />
};

export default CardTimer;