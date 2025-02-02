# To-Do Service

## Overview

The **To-Do Service** manages task creation, updating, deletion, and retrieval. It ensures each task is assigned to a specific user and supports priority-based task management.

## Endpoints

### Task Management

- `GET /` - Retrieve all tasks (Protected).
- `POST /` - Create a new task (Protected).
- `PATCH /:id` - Update an existing task (Protected).
- `DELETE /:id` - Delete a task (Protected).

## Security

- Users must be authenticated to access task-related operations.
- Authorization is enforced via request protection middleware.

## Dependencies

- **@taskly/shared** - Common authentication and CRUD logic.
- **Express** - API routing framework.
- **PostgreSQL & Sequelize** - Database management for tasks.
