
// Author: Simona Zilberberg (GitHub ID: simonaz)

import React, { useState } from 'react';
import CreateUser from "./CreateUser";
import ConfirmUser from "./ConfirmUser";


const Login = function () {
    const [isShown, setIsShown] = useState(true)

    return (
        <div className="Acco-form-container">
            {isShown && (<CreateUser setIsShown={setIsShown}/>)}

            {!isShown && (<ConfirmUser setIsShown={setIsShown}/>)}
        </div>
    )
}

export default Login
