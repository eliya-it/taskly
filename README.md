# Taskly - Microservices-Based To-Do App

## Overview

Taskly is a scalable and cloud-native To-Do application built with **TypeScript, Node.js, Express, PostgreSQL, and Kubernetes**. The application follows a **microservices architecture** and leverages **AWS SQS, SNS, Docker, and Skaffold** for streamlined development and deployment.

## Tech Stack

- **Backend:** Node.js, TypeScript, Express
- **Database:** PostgreSQL (Managed with Sequelize ORM)
- **Microservices Architecture:** Docker, Kubernetes, Skaffold
- **Messaging & Event-Driven Design:** AWS SNS & SQS
- **Authentication & Security:** JWT, Role-Based Access Control (RBAC)
- **Testing:** Jest, Supertest
- **CI/CD:** Skaffold for local development workflow
- **Security:** Kubernetes Secrets & ConfigMaps for sensitive data

## Features

- **User Authentication & Authorization**
  - Signup, login, JWT-based authentication
  - Role-Based Access Control (RBAC)
- **Task Management**
  - CRUD operations for tasks
  - Task prioritization and ownership
- **Notifications System**
  - Asynchronous event-driven notifications
  - Retry logic and Dead Letter Queue (DLQ) support
- **Scalability & Reliability**
  - Containerized with Docker & orchestrated via Kubernetes
  - Efficient message handling with AWS SNS/SQS
- **Automated Testing & CI/CD**
  - Unit and integration tests with Jest
  - Automated deployment pipelines with Skaffold

## Architecture

Taskly follows a **distributed microservices architecture**, ensuring scalability and maintainability. Key services include:

- **User Service:** Handles authentication, user creation, and management.
- **To-Do Service:** Manages tasks, CRUD operations, and priority levels.
- **Notification Service:** Processes SQS messages and sends email or SMS notifications.
- **Event Bus:** Uses AWS SNS/SQS to facilitate event-driven communication between services.

## Setup & Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+)
- **Docker & Kubernetes**
- **Skaffold**
- **kubectl**
- **AWS CLI** (For managing SQS & SNS topics)

### Installation Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/taskly.git
   cd taskly
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure Kubernetes Secrets & ConfigMaps:

   **ConfigMap (Non-Sensitive Data)**
   `
   The following environment variables are required for the application:

   - **AWS_REGION**: The AWS region where the resources are deployed (e.g., `us-east-1`).
   - **AWS_SNS_TOPIC_ARN_USEREVENTS**: The ARN of the SNS topic for user-related events.
   - **AWS_SNS_TOPIC_ARN_TODOEVENTS**: The ARN of the SNS topic for to-do-related events.
   - **AWS_SNS_TOPIC_USEREVENTS**: The name of the SNS topic for user events.
   - **AWS_SNS_TOPIC_TODOEVENTS**: The name of the SNS topic for to-do events.
   - **AWS_NOTIFICATIONS_QUEUE_URL**: The URL of the SQS queue for notifications.
   - **AWS_NOTIFICATIONS_DLQ_URL**: The URL of the Dead Letter Queue for notifications.
   - **AWS_TODOS_QUEUE_URL**: The URL of the SQS queue for to-dos.

   Apply the ConfigMap:

   ```sh
   kubectl apply -f configmap.yaml
   ```

   **Secrets (Sensitive Data)**

   - **AWS Access Key & Secret Access Key**: Required for AWS authentication (Base64 encoded).
   - **PostgreSQL Password**: Database password for secure access (Base64 encoded).

   Apply the Secrets:

   ```sh
   kubectl apply -f secrets.yaml
   ```

4. Start the application with Skaffold:

   ```sh
   skaffold dev
   ```

5. Run tests:
   ```sh
   npm test
   ```

## Deployment

Taskly is designed to be deployed on **Kubernetes** with **CI/CD automation**. Steps include:

- Building and pushing Docker images.
- Applying Kubernetes manifests.
- Configuring AWS SQS/SNS.

To deploy manually:

```sh
kubectl apply -f k8s/
```

Ensure that **AWS credentials** and **PostgreSQL database** are properly configured.
