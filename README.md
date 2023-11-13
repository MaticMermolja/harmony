# Life App

## Vision

........

### Empowering Individuals, Crafting a Better World

Our ambition is to embolden individuals in crafting an enhanced life for themselves and, in turn, forging a brighter world. We aspire to aid them in unlocking their creative potential, navigating toward their life objectives, and sculpting a world wherein. While our application aims to be a helpful companion on your journey toward self-improvement and realization, it's imperative to understand its capabilities and limitations:

- **Not a Life Coach:** The application does not aspire to be a life coach. It will not guide your career trajectory, augment your intelligence, or enhance your aptitude in social, personal, or business arenas.

- **A Balancing Aid:** What the app will do is enable you to introspect and balance your essential needs. It’s crafted to help unlock your full potential, providing you with the tools to create and live a fulfilling life.

In utilizing our application, remember that the power to change, adapt, and grow fundamentally lies within you. Our tool is here to assist and inspire, not to direct or dictate your path.

## Production accessable

https://inharmonyapp.com/

API swagger docs [Only accessable locally]
http://localhost:3000/api/docs

Presentation link: https://docs.google.com/presentation/d/1hnGr0d16PvW40GCBoDu_ywF8zsT1OOQitSrz59iOzGE/

## Running the Application Locally

### Prerequisites
- Ensure you have Docker and Docker Compose installed.

### Sample Configuration of NodeJS API (`env.js`):
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
1. Create the `/api/env.js` file.
2. Copy sample configuration file.
3. Set the `environment` key to `docker` and `HTTPS` to `false`:
    ```javascript
    "environment": "docker",
    "HTTPS":"false"
    ```
4. Run `docker-compose up`
5. Navigate to `http://localhost:4200/`

### Optional: Configuration DEV & HTTPS (Only used for OWASP ZAP, not tested fully)
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
8. Navigate to `https://localhost/`

## Initialization of Database

DB initialization is performed on API start-up. Access point `/db` was deleted, since it is no longer needed.

## UI Plan
![LifeApp UI](./other/LifeApp_UI.drawio.png)

# Testing

## Backend Testing with Mocha and Chai

The backend of the application is thoroughly tested using Mocha and Chai. To execute these tests:

1. Navigate to the `/api` directory in your terminal.
2. Run the command `npm test`.

**Important!** Before testing, please check rateLimit that is set in rateLimit.js. By default it is set to 2. For testing to complete, set it to higher value (20 recommended).
    ```javascript
    const rateLimitMiddleware = setRateLimit({
      windowMs: 1000,
      max: 2,
      message: "You have exceeded your 2 requests per second limit.",
      headers: true,
    });
    ```
### Report

Report is accessable in `/api/test/report` folder.

### Test Details

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