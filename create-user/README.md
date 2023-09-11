## Create User Service

Auth Name: Simona Zilberberg

GitHub ID: simonaz

## Services

**Create User:** In order for a user to purchase a ticket they need to submit their information (full name and email address), which will be used in other services. Once the endpoint is called, first there is a try-catch for any 500 error calls, after the program will check the input information and call a 400 error if any of the input values are incorrect. After, the program will create a random user id and then emit a “Create User” event with the created user information and Id and then save it in the service’s database. Then the serive will sent a 201 status with the user's infromation.  While that occurs the service waits for the “User Confirm” event to check whether the user id is valid and then updates the “confirm” value of the user in the create user database.

## Endpoint

**Create user:  
**URL: /api/v1/users/

Method: POST

    BODY:

    Request Data Constraints:

    {

        "full_name": "[unicode 64 characters max]",

        "email_address": "[unicode 64 characters max]",

    }

    Request Data Example:

    {

        "full_name": "Seth Franklin",

        "email_address": "sjfranklin@umass.edu", 

   }

    Response:

        201 CREATED: If the user was successfully created. Response Data Constraints:

        {

            "full_name": "[unicode 64 characters max]",

            "email_address": "[unicode 64 characters max]",

        }


     Response Data Example:


        {


            "full_name": "Seth Franklin",


           "email_address": "sjfranklin@umass.edu"


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

docker-compose up create-user

```
