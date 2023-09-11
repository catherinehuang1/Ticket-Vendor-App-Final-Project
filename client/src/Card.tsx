
// Author: Catherine Huang (GitHub ID: catherinehuang1)

import React, { useState } from "react";
import axios from 'axios';
import CardTimer from "./CardTimer";

interface Card {
    user_id: string,
    card_number: string,
    billing_address: string,
    expiration_date: string,
    cvv: string
}

const EmptyCard : Card = {
    user_id: '',
    card_number: '',
    billing_address: '',
    expiration_date: '',
    cvv: ''
}

const Card = () => {
    const [card, setCard] = useState(EmptyCard);

    function updateFields(fields: Partial<Card>) {
        setCard((prev) => {
            return { ...prev, ...fields }
        });
    }

    
    const submitCardInfo = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // user id was set in localStorage in ConfirmUser, and then redirected to Seats page
        const user_id = localStorage.getItem('user_id');

        // if (user_id !== null) {
        //     updateFields({ user_id: user_id });
        // }
        await axios.post(`http://localhost:4003/api/v1/cards`, {
            user_id: user_id,
            card_number: card.card_number,
            billing_address: card.billing_address,
            expiration_date: card.expiration_date,
            cvv: card.cvv
        }).then((response) => {
            if(response.status === 201){
                window.location.href = "/order";
            }
        });
       
    }

    return ( 
        <form className = "center" onSubmit={submitCardInfo}>
            <div className="Acco-content">
                <h1 className="Acco-form-title">Insert Credit Card Information</h1>
                <h3 className="Acco-form-instructions">We Accept Visa, MasterCard, and Discover</h3>
                <CardTimer/>
                <div className="form-group mt-3">
                    <label className="required">Card Number</label>
                    <input
                        required
                        type="text"
                        className="form-control mt-1"
                        placeholder="Enter Your Credit Card Number"
                        value={card.card_number}
                        onChange={(e) =>
                            updateFields({ card_number: e.target.value})
                        }
                    />
                </div>
                <div className="form-group mt-3">
                    <label className="required">Billing Address</label>
                    <input
                        required
                        type="text"
                        className="form-control mt-1"
                        placeholder="Enter Your Billing Address"
                        value = {card.billing_address}
                        onChange={(e) => 
                            updateFields({
                                billing_address: e.target.value
                            })
                        }
                    />
                </div>
                <div className="form-group mt-3">
                    <label className="required">Expiration Date</label>
                    <input
                        required
                        type="text"
                        className="form-control mt-1"
                        placeholder="Enter Card Expiration Date"
                        value = {card.expiration_date}
                        onChange={(e) => 
                            updateFields({
                                expiration_date: e.target.value
                            })
                        }
                    />
                </div>
                <div className="form-group mt-3">
                    <label className="required">CVV</label>
                    <input
                        required
                        type="text"
                        className="form-control mt-1"
                        placeholder="Enter Card CVV"
                        value = {card.cvv}
                        onChange={(e) => 
                            updateFields({
                                cvv: e.target.value
                            })
                        }
                    />
                </div>
                <div className="Acco-button-container">
                    <button
                        type="submit"
                        id="submit-card"
                        className="Acco-buttons Acco-button-submit btn btn-primary"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Card;