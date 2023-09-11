## Email User Id Service

Auth Name: Simona Zilberberg

GitHub ID: simonaz

## Services

**Email User Id:** This service sends the generated user id (created in create user), in an email to the user. This service listens to the event type "User Created" in order to get the full name , email address , and user id that will be used to form and send the confirmation email. Befor the email is sent , a log is created of the user which is saved to the email-user-id database.

## Endpoint
This service does not have an end point and listens to the "User Created" event from the eventbus for when to form and send the email.

## Run Instructions

Not in Container:

```NotInContainer

npm install

npm start

```

In Container:

```InContainer

docker-compose up email-user-id

```
