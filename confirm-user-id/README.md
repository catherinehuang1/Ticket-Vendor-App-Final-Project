## Confirm User Service

Auth Name: Simona Zilberberg

GitHub ID: simonaz

## Services

**Confirm User:**  After creating a user, an email will be sent to the user with their user id. The user will re-enter their userid to the client inorder to verify their email. Confirm User service listens to the User Created event from the event bus where it creates a user in the Confirm User database.Once the user confirm endpoint is called, first there is a try-catch for any 500 error calls, after the program will check the input information and call a 400 error if any of the input values are incorrect(which also sends an alert to the user if the user_id is not valid).When service checks the validty of each parameter and they are all correct, it then finds the user in the Confirm User database where it is later updated to "confirmed" = true. Finally a User Confirmed event is emmited to the event bus with the proper user information to be used for other serivces listeding to the event_bus and a 201 status is send with the user id as the body.

## Endpoint

**Confirm user:  
**URL: /api/v1/users/confirm

Method: POST

    BODY:

    Request Data Constraints:
    {
        "user_id": "string",
    }

    Request Data Example:
    {
        "user_id": "d5b7ce",
    }

    Response:

        200 OK: If the user id was successfully confirmed. Response Data Constraints:
    {
        "user_id": "string",
    }

    Response Data Example:
    {
        "user_id": "d5b7ce",
    }

        400 BAD REQUEST: If request data is incomplete

        500 INTERNAL SERVER ERROR: If there is an exception or other error condition that is rare or shouldn't occur

## Run Instructions

Not in Container:

```NotInContainer

npm install

npm start

```

In Container:

```InContainer

docker-compose up confirm-user

```
