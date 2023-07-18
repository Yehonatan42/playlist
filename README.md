# Playlist App

The Playlist App is a feature-rich application that allows users to create, edit, and share playlists with other users. It provides an intuitive graphical user interface (GUI) built using HTML and CSS for a seamless user experience. The app utilizes technologies such as Node.js, Express.js, MongoDB, and Mongoose to handle the backend operations. It also integrates with the Spotify API to search for songs and fetch their metadata. User authentication is implemented using JSON Web Tokens (JWT) for secure access to the app's features.

## Features

- User registration and login to access personalized playlists.
- Create, edit, and delete playlists with custom names and descriptions.
- Add and remove songs from playlists.
- Search for songs using the Spotify API and fetch their metadata.
- Share playlists with other users for collaborative music discovery.
- User-friendly graphical user interface (GUI) built with HTML and CSS.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Jest
- Supertest
- Spotify API
- JSON Web Tokens (JWT)
- HTML
- CSS

## Setup

To set up the Playlist App, follow these steps:

1. Clone the repository:
git clone https://github.com/Yehonatan42/playlist.git


2. Install the dependencies:
cd playlist-app
npm install


3. Configure the environment variables:
- Create a `.env` file in the project root directory.
- Add the following environment variables:
  ```
  JWT_SECRET=<your-jwt-secret>
  SPOTIFY_KEY=<your-spotify-api-key>
  MONGODB_URI=<your-mongodb-uri>
  __MONGODB_URI__=<your-test-mongodb-uri>

  ```

4. Start the application:
npm start


5. Access the application at `http://localhost:3000`.


## Testing

The Playlist App includes comprehensive tests written using Jest and Supertest. These tests cover various functionalities of the app, ensuring its robustness and reliability. To run the tests, use the following command:

npm test


## Spotify API Integration

The app seamlessly integrates with the Spotify API to provide a vast library of songs for users to search and add to their playlists. By leveraging the Spotify API, the app fetches song metadata, including title, artist, and duration, ensuring accurate and up-to-date information.

## Authentication using JWT

User authentication is implemented in the Playlist App using JSON Web Tokens (JWT). Upon registration or login, users receive a JWT token that authenticates their subsequent requests. This token is included in the request headers to grant access to protected routes, ensuring secure and authorized usage of the app.

## MongoDB and Mongoose Schemas

The app employs MongoDB as the database solution, storing user information, playlist data, and song details. The Mongoose library facilitates schema creation, enabling the definition of the data structure and validation rules. This allows for efficient data management and retrieval while maintaining data integrity.

## Front-end GUI

The Playlist App features a user-friendly graphical user interface (GUI) built with HTML and CSS. The GUI provides an intuitive and visually appealing interface for users to interact with the app's functionalities. Through the GUI, users can easily create, edit, and manage their playlists, search for songs, and share playlists with other users.

