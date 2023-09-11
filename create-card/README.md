## Create Card Service

Author: Catherine Huang

GitHub ID: catherinehuang1

# Description:

The Create Card service checks if there is a valid user attached to the incoming credit card information, and then creates a credit card object, stores it in its cards collection, and sends the card object out via a POST request. This service has 2 collections in its database, one to store users and the other to store card information.

It does this by listening for a UserConfirmed event that holds a user_id, then adds the user_id to its own valid_user_id collection in its database. If there is a valid user_id, it uses the incoming credit card information from the request body and sends it out to the Confirm Card service via a POST request using the /api/v1/cards endpoint.


URL: /api/v1/cards

METHOD: POST

BODY:

    Request Data Constraints:
        {
            "user_id": "string",
            "card_number": "string",
            "billing_address": "string",
            "expiration_date": "string",
            "cvv": "string"
        }
    Request Example:
        {
            "user_id": "d5b7ce",
            "card_number": "1234567890123456",
            "billing_address": "181 Presidents Drive, Amherst MA, 01003",
            "expiration_date": "01/01",
            "cvv": "123"
        }



RESPONSE: 

201 CREATED: If the credit card information was successfully submitted. 

    Response Data Constraints: 
        {
            "user_id": "user_id",
            "card_number": "string",
            "billing_address": "string",
            "expiration_date": "string",
            "cvv": "string"
        }

    Response Data Example:
        {
            "user_id": "d5b7ce",
            "card_number": "1234567890123456",
            "billing_address": "181 Presidents Drive, Amherst MA, 01003",
            "expiration_date": "01/01",
            "cvv": "123"
        }

400 BAD REQUEST: If request data is incomplete or the user id isn’t valid

500 INTERNAL SERVER ERROR: If there is an exception or other error condition that is rare or shouldn't occur


# To run this service:

You can run the service either on your machine or using Docker:

1. On your machine: Install dependencies, then run

npm install
npm start

2. OR run this specific service on Docker

docker-compose up create-card
