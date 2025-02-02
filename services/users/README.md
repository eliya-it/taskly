# User Service

## Overview

The **User Service** handles authentication, authorization, and user management within the Taskly application. It provides secure authentication mechanisms using JWT, supports password management, and allows users to manage their accounts.

## Endpoints

### Authentication

- `POST /signup` - Register a new user.
- `POST /login` - Authenticate user and return JWT.
- `POST /forgotPassword` - Initiate password reset via email.
- `POST /resetPassword/:token` - Reset password using a token.
- `POST /logout` - Log out the user.
- `GET /validateToken` - Validate the authentication token.

### User Management

- `PATCH /updatePassword` - Update user password (Protected).
- `DELETE /deleteMe` - Delete user account (Protected).

## Security

- JWT-based authentication.
- Role-based access control.
- Password hashing and secure storage.

## Dependencies

- **@taskly/shared** - Shared utilities for authentication and request protection.
- **Express** - Routing and middleware handling.
