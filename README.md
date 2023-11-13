# Life App

## Vision

........

### Empowering Individuals, Crafting a Better World

Our ambition is to embolden individuals in crafting an enhanced life for themselves and, in turn, forging a brighter world. We aspire to aid them in unlocking their creative potential, navigating toward their life objectives, and sculpting a world wherein. While our application aims to be a helpful companion on your journey toward self-improvement and realization, it's imperative to understand its capabilities and limitations:

- **Not a Life Coach:** The application does not aspire to be a life coach. It will not guide your career trajectory, augment your intelligence, or enhance your aptitude in social, personal, or business arenas.

- **A Balancing Aid:** What the app will do is enable you to introspect and balance your essential needs. It’s crafted to help unlock your full potential, providing you with the tools to create and live a fulfilling life.

In utilizing our application, remember that the power to change, adapt, and grow fundamentally lies within you. Our tool is here to assist and inspire, not to direct or dictate your path.

## Production accessable

https://life-app.onrender.com/

API swagger docs:
https://life-app.onrender.com/docs

Admin: [FIRST INIT DB]
https://life-app.onrender.com/db
  - **Email:** admin@admin.com
  - **Password:** admin

Presentation link: https://docs.google.com/presentation/d/1hnGr0d16PvW40GCBoDu_ywF8zsT1OOQitSrz59iOzGE/

## Running the Application Locally

### Prerequisites
- Ensure you have Docker and Docker Compose installed.

### Sample Configuration (`env.js`):
2. Copy and paste following data to env.js to run application locally.
```javascript
module.exports = {
    "port": 3000,
    "jwt_secret": "YOUR_SECRET_KEY",
    "jwt_expiration_in_seconds": 36000,
    "permissionLevels": {
        "NORMAL_USER": 1,
        "ADMIN": 2
    },
    "environment": "dev", // Possible: docker, dev, test, prod
    "HTTPS":"true",
    "openai_api_key": "YOUR_OPENAI_API_KEY",  // Replace with your key, you can try this functionalitty in production env
    "dbURI": "YOUR_MONGODB_CONNECTION_STRING" // Replace with your mongodb connection string
};
```

### Configuration DOCKER & HTTP
1. Create the `/api/env.js` file to set the `environment` key to `docker`:
    ```javascript
    "environment": "docker",
    "HTTPS":"false"
    ```

2. Run `docker-compose up`
3. Navigate to `http://localhost:4200/`

### Configuration DEV & HTTPS
1. Create the `/api/env.js` file to set the `environment` key to `docker`:
    ```javascript
    "environment": "dev",
    "HTTPS":"true"
    ```

Don't forget to update mongodb connection string.

2. Generate a Self-Signed SSL Certificate
`openssl genrsa -out server.key 2048`
`openssl req -new -x509 -key server.key -out server.cert -days 3650 -subj /CN=localhost`

3. Copy `server.key` and `server.cert` in `/api/cert` & `/front/cert` dir
4. `cd api`
5. `npm start`
6. `cd ../front`
7. `ng serve --configuration https`

## Initialization of Database

When initializing the database through `/db`, two significant operations are performed:

- **Questions Addition:** 
  - Questions are essential for the user onboarding process, during which the initial state of user elements is calculated.
  - Upon completing the onboarding process, users are redirected to the index page where actions can be performed.

- **Actions Addition:** 
  - Actions alter the user’s current element statistics. 
  - Actions data does not represent any real-world meaningful data and is structured to showcase the demo functionality of actions within the application.
  - All test data for actions was generated with the assistance of AI.

- **Creation of ADMIN Default User:** 
  - Admin credentials upon database initialization:
    - **Email:** admin@admin.com
    - **Password:** admin

### Data Deletion

Upon executing `/db/delete`, the following operations will be performed:

- All data within the database, stored through models including `QuestionModel`, `UserModel`, `ActionModel`, and `UserRatingsModel` will be deleted.
- A prompt should always be presented to the user to confirm the action as this is a non-reversible operation.

## UI Plan
![LifeApp UI](./other/LifeApp_UI.drawio.png)

# Testing

## Backend Testing with Mocha and Chai

The backend of the application is thoroughly tested using Mocha and Chai. To execute these tests:

1. Navigate to the `/api/tests` directory in your terminal.
2. Run the command `npm test`.

The testing process includes several steps to ensure the robustness of the backend functionalities:

### Registration

A new user with a randomly generated email and a default password (`admin`) is created to simulate the registration process.

### Authentication

The system tests the login functionality by authenticating the newly registered user, securing an access token for subsequent actions.

### User Journey

With the acquired token, the test simulates a user completing the entire onboarding process with default values.

### Actions Testing

Once onboarding is complete, the system enumerates all actions the user can perform, followed by marking a single action as done to validate this functionality.

### Clean-Up

In the end, the test ensures that the generated user is deleted. This action is performed by an admin user, which is pre-created upon the initial run of the application.

## Test Details

Here is a high-level overview of the `test.js` file:

- The test suite initializes by setting up the necessary environment.
- User credentials are dynamically generated to avoid collision and ensure unique test cases.
- Registration and login tests are conducted to validate user creation and authentication.
- The onboarding process is broken down into multiple steps, each tested for proper data handling and response.
- User actions are then listed, and one is marked as done to check the update mechanism.
- Upon completion of tests, a clean-up process removes the test user to maintain integrity.

Each test is designed to be self-contained, and timeouts are implemented where necessary to accommodate asynchronous operations.

For more detailed insight into the testing logic, you can review the `test.js` file within the same directory.

## User Management

### Types of Users

We manage three user types within the application:

- **NORMAL_USER:** This is the default user type when a new user is registered, assigned `permissionLevel 1`.
- **ADMIN:** This user type has elevated privileges and is assigned `permissionLevel 2`. ADMIN can be created by manually altering the database or utilizing an existing ADMIN user that is created when initializing database. 
- **NOT AUTHENTICATED USER:** User that does not login to application can not perform any actions, except for db initialization and deletion, for demo purposes.

#### Permissions 

- **NORMAL_USER:** 
  - Has access to the boarding process.
  - Can perform actions.
- **ADMIN:** 
  - Can create new actions.
  - Can edit existing actions.
  - Can delete users.
  - Can perform all boarding actions similar to regular users.
  - Admin credentials upon database initialization:
    - **Email:** admin@admin.com
    - **Password:** admin

## External API Integration

### OpenAI API

The application integrates with OpenAI's GPT-3.5 API to generate motivational quotes, providing an additional layer of user engagement.

Example API Call:

```javascript
const inspirationQuoteResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
        role: 'user',
        content: `Show one sentence inspiring quote to the user.`
    }],
    max_tokens: 100
});
```

**Note:** While OpenAI API is a paid service, the inclusion of it in this project is for testing purposes due to its low load. Future expansions may leverage OpenAI for suggesting user actions after thorough data calibration.

## Additional Functionalities

### Drag and Drop

Implemented utilizing `Sortable/1.14.0/Sortable.min.js`, the drag and drop functionality allows users to intuitively sort their most important elements, enhancing user experience and interactivity.

## API Endpoints

1. **Auth Endpoints:**
   - Login
     - Show: `GET /auth/login`
     - Execute: `POST /auth/login`
   - Register
     - Show: `GET /auth/register`
     - Execute: `POST /auth/register`

2. **Boarding Endpoints:**
   - Show Boarding: `GET /boarding`
   - Calculate Boarding: `POST /boarding/:step`
   
3. **Admin Endpoints:**
   - List All Actions: `GET /admin/action/list`
   - Create New Action
     - Get: `GET /admin/action/create`
     - Put: `PUT /admin/action/create`
   - Update Action: `PATCH /admin/action/patch/:id`
   - Get User By ID: `GET /user/:id`
   - List All Users: `GET /users`
   - Delete User By ID: `DELETE /user/delete/:id`

4. **Utility Endpoints:**
   - Get Questions: `GET /questions/get`
   - Get OpenAI Quote: `GET /openai/get/quote`
   - List All User Ratings: `GET /ratings/get/all`
   - Mark Action as Done: `POST /mark-as-done`
   
5. **DB Endpoints:**
   - Show DB Init: `GET /db`
   - Delete All DB Data: `POST /db/delete`
   - Init App Data: `POST /db/init`

## Database Schema Overview

The database schema is organized to store user information, user actions, and questions for onboarding, each having a defined set of attributes to support functionalities and operations within the application.

### 1. User Table: Comprehensive User Information

**Attributes:**
- `id`: Unique identifier.
- `firstName` & `lastName`: User's name.
- `permissionLevel`: User role (`1` for normal users, `2` for admin).
- `email`: Unique email ID.
- `body`, `mind`, `sense`, `relations`, `journey`, `love`: Integers (1-100) representing aspects of a user.
- `boardingLevel`: The level at which user is on the onboarding process (`1` or `2`).

### 2. Action Table: Defining User Actions and Impacts

**Attributes:**
- `id`: Unique identifier.
- `name`: Action name.
- `desc`: Description of the action.
- `changeBody`, `changeMind`, `changeSense`, `changeRelations`, `changeJourney`, `changeLove`: Impact values for respective user attributes.

**Notes:**
- Actions have the capability to modify user attributes (e.g., `changeBody` alters the `body` attribute of a user).

### 3. Question Table: Onboarding Question Information

**Attributes:**
- `id`: Unique identifier.
- `shortcode`: Short code reference.
- `desc`: Description/question text.
- `ratingBody`, `ratingMind`, `ratingSense`, `ratingRelations`, `ratingJourney`, `ratingLove`: Impact ratings for corresponding user attributes.

**Operation:**
- Questions play a crucial role in calculating and assigning initial values to a user's attributes during onboarding.

### 4. Ratings Elements Table: Storing Onboarding Outcomes and User Preferences

**Attributes:**
- `id`: Unique identifier.
- `userId`: Reference to the user.
- `ratingBody`, `ratingMind`, `ratingSense`, `ratingRelations`, `ratingJourney`, `ratingLove`: User’s aspect ratings from onboarding.