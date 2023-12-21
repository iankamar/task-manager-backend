# Project Overview

This project is a part of a web-based task manager application. The backend is built using Node.js with Express.js and a chosen database (e.g., MongoDB) to store user and task information.

## Key Features

- **User Authentication:** Users can register, log in, and log out. Password hashing is implemented for security. A “Forgot Password” functionality is available for password recovery.
- **Task Management:** Users can create, read, update, and delete tasks. Each task has a title, description, due date, and status (e.g., in-progress, completed).
- **Role-Based Authorization:** Differentiates between regular users and admin users. Admin users have additional privileges, such as the ability to view and manage all tasks.

## Security Measures

Secure coding practices have been applied to protect against common vulnerabilities such as Cross-Site Scripting and Cross-Site Request Forgery. User input is validated to prevent malicious activities.

## Testing

Unit tests have been written for critical components to ensure functionality and reliability. End-to-end testing has been performed to validate the complete workflow.

## Technologies and Techniques Used

The project utilizes the following technologies:

- Node.js for the server environment.
- Express.js for handling API requests.
- MongoDB for the database.
- Mongoose for object modeling and managing relationships between data.
- JSON Web Tokens (JWT) for user authorization.

## Running the Project

Use the following commands to run the project:

- `npm run start` — Launches the server.
- `npm run dev` — Launches the server with the hot reload feature.

## Accessing the Application

To access the application, use the following domain:

- Domain: [Ian Kamar's TASK MANAGER](https://iankamar-taskmanager.netlify.app)
