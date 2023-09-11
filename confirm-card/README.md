## Confirm Card Service

Author: Catherine Huang

GitHub ID: catherinehuang1

# Description:

The Confirm Card service takes in credit card information and verifies if the card number, expiration date, and cvv are valid. The service takes in the CardCreated event from which it grabs the card's information.

It checks the card number using the imported Luhn algorithm. The service does not have any endpoints, but instead adds the card to its database with either the status of "accepted" or "denied", a timestamp of when the card was logged, and the card object. 

The service emits either the event CardAccepted or CardDenied, which is received by both the Seats service and the Confirm Order service to tell those services whether they can proceed with booking the seats for the user with this card.


# To run this service:

You can run the service either on your machine or using Docker:

1. On your machine: Install dependencies, then run

npm install
npm start

2. OR run this specific service on Docker

docker-compose up confirm-card
