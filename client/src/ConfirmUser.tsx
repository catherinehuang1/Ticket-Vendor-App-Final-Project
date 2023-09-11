
// Author: Simona Zilberberg (GitHub ID: simonaz)

import React, { useState } from 'react'
import axios from 'axios'

interface ConfirmUserProps {
    setIsShown: React.Dispatch<React.SetStateAction<boolean>>
}

const ConfirmUser = function ({ setIsShown }: ConfirmUserProps) {
    const [user_id,set_user_id] = useState("");

    const submitConfirmUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log('inside submitConfirmUser')
        console.log('entered UserId',user_id)

        await axios.post(`http://localhost:4001/api/v1/users/confirm`, {
            user_id: user_id,
        }).then((response)=>{
            console.log(response)
            if (response.status === 201){
                localStorage.setItem('user_id',user_id)
                window.location.href = "/seats";
            }
        })
        
    }

    return (
        <form className="Acco-form" onSubmit={submitConfirmUser}>
            <div className="Acco-content">
                <h3 className="Acco-form-title">Confirm Account</h3>
                <div className="form-group mt-3">
                    <label className="required">User ID</label>
                    <p className="Acco-form-instructions">
                        Enter your User ID from the Email that was sent to you
                        in order to confirm your Account{' '}
                    </p>
                    <input
                        required
                        type="userID"
                        className="form-control mt-1"
                        placeholder="Enter Your User ID"
                        value={user_id}
                        onChange={(e) =>
                            set_user_id(e.target.value)
                        }
                    />
                </div>
                <div className="Acco-button-container">
                    {/* Confirm user and move to the next page*/}
                    <button
                        type="submit"
                        id="user-confirm-submit"
                        className="Acco-buttons Acco-button-submit btn btn-primary"
                    >
                        Submit
                    </button>
                    <button
                        type="reset"
                        className="Acco-buttons btn btn-secondary"
                        onClick={() => setIsShown((oldIsShown) => !oldIsShown)}
                    >
                        Restart
                    </button>
                </div>
            </div>
        </form>
    )
}

export default ConfirmUser
