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

## Running the Application

To start the application in development mode, navigate to the project directory in your terminal and run the following command:

```bash
npm run dev
```
