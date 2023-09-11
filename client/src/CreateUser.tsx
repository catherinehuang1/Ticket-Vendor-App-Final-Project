
// Author: Simona Zilberberg (GitHub ID: simonaz)

import React, { useState } from 'react'
import axios from 'axios'

interface UserInterface {
    full_name: string
    email_address: string
}

const UserInitial: UserInterface = {
    full_name: '',
    email_address: '',
}

interface Props {
    setIsShown: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateUser = function ({setIsShown}: Props) {
    const [user, setUser] = useState(UserInitial);

    function updateFields(fields: Partial<UserInterface>) {
        console.log('inside updateFields', fields)
        setUser((prev) => {
            console.log(user)
            return { ...prev, ...fields }
        })
    }

    const submitCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log('inside submitCreateUser')
        setIsShown(oldIsShown => !oldIsShown)

        await axios.post(`http://localhost:4000/api/v1/users/`, {
            full_name: user.full_name,
            email_address: user.email_address,
        })

        console.log('user ', user)
    }

    return (
        <form className="Acco-form" onSubmit={submitCreateUser}>
            <div className="Acco-content">
                <h3 className="Acco-form-title">Create an Account</h3>
                <div className="form-group mt-3">
                    <label className="required">Full Name</label>
                    <input
                        required
                        type="text"
                        className="form-control mt-1"
                        placeholder="Enter Your Full Name"
                        value={user.full_name}
                        onChange={(e) =>
                            updateFields({ full_name: e.target.value })
                        }
                    />
                </div>
                <div className="form-group mt-3">
                    <label className="required">Email</label>
                    <input
                        required
                        type="text"
                        className="form-control mt-1"
                        placeholder="Enter Your Email"
                        value={user.email_address}
                        onChange={(e) =>
                            updateFields({
                                email_address: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="Acco-button-container">
                    <button
                        type="submit"
                        id="user-create-submit"
                        className="Acco-buttons Acco-button-submit btn btn-primary"
                    >
                        Submit
                    </button>
                    <button
                        type="reset"
                        className="Acco-buttons btn btn-secondary"
                        onClick={() => setIsShown((oldIsShown) => !oldIsShown)}
                    >
                        Skip
                    </button>
                </div>
            </div>
        </form>
    )
}

export default CreateUser