# TeamJoin Backend and Frontend

This project is a full-stack application that includes a Python backend and a React frontend. It allows users to create profiles, share project ideas, and connect with other users.

## Features

- User authentication (signup, login, password reset)
- User profile management (create, read, update)
- Idea management (create, read, view details)
- Search for users and ideas

## Project Structure

The project is organized into the following directories:

- `auth/`: Backend authentication logic
- `feed/`: Backend logic for the user feed
- `frontend/`: React frontend application
- `ideas/`: Backend logic for managing ideas
- `message/`: Backend logic for messaging (not yet implemented)
- `search/`: Backend logic for search
- `user/`: Backend logic for user profile management

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js and npm

### Backend Setup

1.  Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```
2.  Run the backend server:
    ```bash
    uvicorn main:app --reload
    ```
    The backend will be running at `http://127.0.0.1:8000`.

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the required npm packages:
    ```bash
    npm install
    ```
3.  Run the frontend application:
    ```bash
    npm start
    ```
    The frontend will be running at `http://localhost:3000`.

## API Endpoints

The backend provides the following API endpoints:

- `POST /auth/signup`: Register a new user.
- `POST /auth/token`: Log in a user and get an access token.
- `POST /auth/forgot-password`: Send a password reset email.
- `GET /feed/`: Get the user's feed of ideas.
- `GET /search/?q={query}`: Search for users and ideas.
- `GET /user/profile`: Get the current user's profile.
- `PUT /user/profile`: Update the current user's profile.
- `POST /ideas/`: Create a new idea.
- `GET /ideas/{id}`: Get the details of a specific idea.

## Frontend Components

The frontend is built with React and includes the following main components:

- `Dashboard`: The main page after logging in, displaying the user's profile and ideas.
- `CreateIdea`: A form to create a new idea.
- `IdeaDetail`: A page to display the details of a specific idea.
- `Login`, `Signup`, `ForgotPassword`: Authentication pages.
- `SearchPage`: A page to search for users and ideas.
