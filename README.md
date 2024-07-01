# Card Back Quest
[Visit Card Back Quest](https://capstone-frontend-4nmb.onrender.com)

## Description
Card Back Quest is a website for Hearthstone enthusiasts to explore, collect, and showcase their favorite card back designs. Users can create accounts, view detailed designs, like their favorites, and manage their personal card back collection.

## Features
These features were implemented to provide a comprehensive and engaging experience for users who enjoy the Hearthstone card backs, allowing them to interact with and manage their collection in a fun and organized way:
- **User Authentication:** Users can sign up, log in, and manage their profiles securely.
- **Card Back Gallery:** Browse all available Hearthstone card backs with detailed descriptions and images.
- **Favorites & Collections:** Like card backs and add them to your personal collection.
- **Profile Management:** Edit your profile details and view your collection and liked card backs.

## Tests
To run the tests:
- **Backend:** Navigate to the backend folder and type:
  ```bash
  jest

- **Frontend:** Navigate to the frontend folder and type:
  ```bash
  npm test

## User Flow
- **Landing Page:** Users can sign up or log in.
- **Dashboard:** After logging in, users can view their liked and collected card backs.
- **Card Back Gallery:** Browse for card backs, like them, and add them to your collection.
- **Profile Page:** Edit profile details and manage collection.
- **Logout:** Securely log out to end the session.

## API
**`Battle.net` API**
https://develop.battle.net/

`Battle.net` API is utilized to fetch data about Hearthstone card backs. The API provides endpoints for retrieving all available card backs and specific card details.

**Custom API**
A custom API was developed to manage user data, card back collections, and user interactions. It also stores the information from the card backs from the Battle.net API to avoid API rate limiting with the Battle.net API.

## Technology Stack
- **Front-End:** React
- **Back-End:** Node.js, Express
- **Database:** PostgreSQL
- **Testing:** Jest