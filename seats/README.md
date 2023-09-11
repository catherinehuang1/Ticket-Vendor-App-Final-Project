## Create Card Service

Author: Catherine Huang

GitHub ID: catherinehuang1

# Description:

The Seats service handles whether each seat's status is "open", "processing", or "sold". It has 2 collections in its database--one that stores valid user_ids, and the other that stores the seats and their information (row/column, status, associated user id if the seat is sold/processing)

This service takes in multiple events: 

 - UserConfirmed event, from which it adds the user to its valid_user_ids collection

 - CardAccepted/CardDenied events, which tell the service whether to update the seat's status as being "open" or "sold", respectively.

 - TimerExpired event, which tell the server whether the timer went up and has the server set the seats' status to "open" (the user loses their seats because they took too long to enter their credit card information)

# Endpoints

The Seats service has both a GET and POST request.

1. The GET request gets all of the seats and their information from its database.

ENDPOINT: List all seats
URL: /api/v1/seats/

METHOD: GET

BODY:

    Request Data Constraints:

        { "user_id": string }

    Request Example:
        { "user_id": "5abc52dd12" }


RESPONSE: 

200 OK: If the user id is valid, it returns all of the seats. 

    Response Data Constraints:
[
{
			"row": "number",
			"column": "number",
			"status": "open" | "processing" | "sold",
		} …
]

    Response Data Example:
       [
{
			"row": 1,
			"column": 1,
			"status": "open”,
		},
{
			"row": 1,
			"column": 2,
			"status": "sold”,
		},
{
			"row": 1,
			"column": 3,
			"status": "processing”,
		}
]

400 BAD REQUEST: If request data is incomplete or the user id isn’t valid

500 INTERNAL SERVER ERROR: If there is an exception or other error condition that is rare or shouldn't occur


2. The POST request claims the seats that the user has selected by setting their status to "processing", or telling the user if those seats have already been taken.

ENDPOINT: Select seats
URL: /api/v1/seats/

METHOD: POST

BODY:

    Request Data Constraints:
        {
            "user_id": "string",
            "seats": [
                {
                    "row": "number",
                    "column": "number",
                },...
            ]
        }


    Request Example:
        {
            "user_id": "5abc52dd12",
            "seats": [
                {
                    "row": 1,
                    "column": 2,
                },
                {
                    "row": 1,
                    "column": 3,
                },
            ]
        }


RESPONSE: 

200 OK: If the seats were successfully selected. 

    Response Data Constraints: 
        {
            "user_id": "string",
            "seats": [
                {
                    "row": "number",
                    "column": "number",
                },
            ]
        }

    Response Data Example:
         {
            "user_id": "5abc52dd12",
            "seats": [
                {
                    "row": 1,
                    "column": 2,
                },
                {
                    "row": 1,
                    "column": 3,
                },
            ]
        }

400 BAD REQUEST: If request data is incomplete, or the seats selected were already taken, or the user id isn’t valid

500 INTERNAL SERVER ERROR: If there is an exception or other error condition that is rare or shouldn't occur




# To run this service:

You can run the service either on your machine or using Docker:

1. On your machine: Install dependencies, then run

npm install
npm start

2. OR run this specific service on Docker

docker-compose up seats
