
## React front end service

Authors:
- Seth Franklin (GitHub ID: SethFranklin)
- Catherine Huang (GitHub ID: catherinehuang1)
- Simona Zilberberg (GitHub ID: simonaz)

This is the web front end of the project. It uses React and was written in Typescript. It uses the axios library to make API calls to services on the backend. Users can connect to this service at the URL: http://localhost:3000/

These are the back end services it connects to to make API calls:
- create-user to make a user through it's endpoint
- confirm-user-id to send a user id in for confirmation through it's endpoint
- seats to view the available seats and select seats through it's endpoints
- create-card to send in credit card info through it's endpoint
- order to get final order confirmation info through it's endpoint

Here are all of the React components and their authors:

**Login.tsx (made by Simona)**:

* Main paige which hides and shows CreateUser and ConfirmUser Components

**CreateUser.tsx (made by Simona)**:

* In order for a user to purchase a ticket they need to submit their information 
* Contains Required functionalities to the two user inputs , so if for example a user was to only enter her name , the submit button would not go through to the next page
* Once the user puts in their user name and email address, the create-user service will create a special generated user_id that will be sent in the email confirmation.
* There is a skip button, so if an account was already created, you can go to the confirmation page and add in your user id

**ConfirmUser.tsx (made by Simona)**:

* If the user id was not sent to the user properly, they can Click the “Restart” button to go back to the create user page 
* The inputs on this page also have the same required functionality
* After receiving the correct user_id , a user can click the submit button which will change the user’s status to confirmed in the Create User and Confirm User database

**index.tsx (made by Seth)**:

* This is the entry point into the website. It uses the library "react-router-dom" to route between the different pages of the website.

**Seats.tsx (made by Seth)**:

* This is the main component of the seats page, and encompasses all of the other components on it. It uses axios to get the seats and sends the seats to it's children components as props.

**Grid.tsx (made by Seth)**:

* This component makes a grid of the SeatButton element, based on the seats that were passed through it as a prop.

**SeatButton.tsx (made by Seth)**:

* This is the component of a single button to click and select a seat. If the seat is processing or already sold, it will be grayed out and not able to be clicked. Selecting or deselecting a seat changes the effect hook "seats_selected", which is an array of all the seats selected.

**SubmitSeats.tsx (made by Seth)**:

* This is a button to submit seats to the back end using an API endpoint. If no seats are selected, the button will be grayed out and unclickable. If the endpoint gives a 200 success, it will re-direct the user to the cards page. On an endpoint error, it will refresh the page.

**Order.tsx (made by Seth)**:

* This is the page that shows the final order confirmation info. It gets the info from an API endpoint on the confirm-order service, and displays it nicely here.

**DoesntExist.tsx (made by Seth)**:

* This is like a 404 page for when the user tries to access a page that doesn't exist.

**Card.tsx (made by Catherine)**:

* This is the page where you enter your credit card information. Each textbox in this form is required to be filled. The page grabs the user_id from the localStorage, which is passed from the UserConfirmed event. The information gets sent to the create-card service, which creates the card and passes it to the confirm-card service, which uses the Luhn algorithm to make sure the credit card number is valid. It also checks if the format of the CVV and the expiration date are correct.

**CardTimer.tsx (made by Catherine)**:

* This is a 1 minute timer that shows the user how much time they why have until they lose their seats and get redirected to an error page.

## How to run this service

If you want to run the service, you can do it on your machine using npm. First run this to install the dependencies:

    npm install

Then run this to start the service:

    npm start

Alternatively, you can use docker compose to run this service using:

    docker-compose up client