# Project Overview

This project is a part of a web-based task manager application. The backend is built using Node.js with Express.js and a chosen database (e.g., MongoDB) to store user and task information.
<img width="847" alt="Task Manager A" src="https://github.com/iankamar/task-manager-backend/assets/95672055/d0cd0815-6741-45e6-a3be-af9d96a4c8ae">
<img width="848" alt="Task Manager B" src="https://github.com/iankamar/task-manager-backend/assets/95672055/f0a8aa12-a50e-41cb-a71a-f2147142e47b">
<img width="844" alt="Task Manager C" src="https://github.com/iankamar/task-manager-backend/assets/95672055/d277baf8-8c42-41d5-8be7-80f79c6c0c58">
<img width="721" alt="Task Manager D" src="https://github.com/iankamar/task-manager-backend/assets/95672055/7023ff15-053b-407f-ac2c-ce14a4c342fa">
<img width="856" alt="Task Manager E" src="https://github.com/iankamar/task-manager-backend/assets/95672055/70996ccb-b7fa-4a4e-8d79-7b657fd3e458">
<img width="857" alt="Task Manager F" src="https://github.com/iankamar/task-manager-backend/assets/95672055/29ca4997-f9db-4740-8503-0d688d91fe52">


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

## Backend Domain

Backend Domain

- Domain: [BACKEND DOMAIN](https://task-manager-backend-livid.vercel.app/)

## Running the Project

Use the following commands to run the project:

- `npm run start` — Launches the server.
- `npm run dev` — Launches the server with the hot reload feature.
<!--
## Accessing the Application

To access the application, use the following domain:

- Domain: [Ian Kamar's TASK MANAGER](https://iankamar-taskmanager.azurewebsites.net)
--!>
