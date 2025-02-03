# **Taskly - Microservices-Based To-Do App**

## **Overview**

Taskly is a scalable and cloud-native To-Do application built with **TypeScript, Node.js, Express, PostgreSQL, and Kubernetes**. The application follows a **microservices architecture** and leverages **AWS SQS, SNS, Docker, and Skaffold** for streamlined development and deployment.

## **Tech Stack**

- **Backend:** Node.js, TypeScript, Express
- **Database:** PostgreSQL (Managed with Sequelize ORM)
- **Microservices Architecture:** Docker, Kubernetes, Skaffold
- **Messaging & Event-Driven Design:** AWS SNS & SQS
- **Authentication & Security:** JWT, Role-Based Access Control (RBAC)
- **Testing:** Jest, Supertest
- **CI/CD:** Skaffold for local development workflow
- **Security:** Kubernetes Secrets & ConfigMaps for sensitive data

## **Features**

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

## **Architecture**

Taskly follows a **distributed microservices architecture**, ensuring scalability and maintainability. Key services include:

- **User Service:** Handles authentication, user creation, and management.
- **To-Do Service:** Manages tasks, CRUD operations, and priority levels.
- **Notification Service:** Processes SQS messages and sends email or SMS notifications.
- **Event Bus:** Uses AWS SNS/SQS to facilitate event-driven communication between services.

---

## **Setup & Installation**

### **Prerequisites**

Ensure you have the following installed:

- **Node.js** (v18+)
- **Docker & Kubernetes**
- **Skaffold**
- **kubectl**
- **AWS CLI** (For managing SQS & SNS topics)

### **Installation Steps**

1. **Clone the repository**:

   ```sh
   git clone https://github.com/eliya-it/taskly.git
   cd taskly
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Configure Kubernetes Secrets & ConfigMaps**:

   **ConfigMap (Non-Sensitive Data)**

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
   kubectl apply -f config-map.yaml
   ```

   **Secrets (Sensitive Data)**

   - **AWS Access Key & Secret Access Key**: Required for AWS authentication (Base64 encoded).
   - **PostgreSQL Password**: Database password for secure access (Base64 encoded).

   Apply the Secrets:

   ```sh
   kubectl apply -f secrets.yaml
   ```

4. **Start the application with Skaffold**:

   ```sh
   skaffold dev
   ```

5. **Run tests**:
   ```sh
   npm test
   ```

---

## **Deployment**

Taskly is designed to be deployed on **Kubernetes** with **CI/CD automation**. Steps include:

- Building and pushing Docker images.
- Applying Kubernetes manifests.
- Configuring AWS SQS/SNS.

To deploy manually:

```sh
kubectl apply -f k8s/
```

Ensure that **AWS credentials** and **PostgreSQL database** are properly configured.

---

## **ECS Task Setup**

This project includes pre-configured **ECS task definitions** for deploying services on AWS ECS. **Since this is a portfolio project, AWS deployment is not required, but ECS configurations are included in the repository to demonstrate AWS experience.**

### **1. Update AWS Account & Region**

Before registering the ECS tasks, update the following placeholders in the JSON files under the `services` directory:

- Replace `<YOUR_AWS_ACCOUNT_ID>` with your **AWS Account ID**
- Replace `<AWS_REGION>` with your **AWS region** (e.g., `us-east-1`)

Example update in the task definition JSON files:

```json
"executionRoleArn": "arn:aws:iam::<YOUR_AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole"
```

### **2. Register ECS Task Definitions**

Once the placeholders are updated, register the tasks using the **AWS CLI**:

```sh
aws ecs register-task-definition --cli-input-json file://services/notifications/notification-dlq-task.json
aws ecs register-task-definition --cli-input-json file://services/todos/todo-listener-task.json
aws ecs register-task-definition --cli-input-json file://services/todos/todo-service-task.json
aws ecs register-task-definition --cli-input-json file://services/client/client-service-task.json
```

### **3. Verify the Registered Tasks**

After running the commands, verify that the tasks have been registered successfully:

1. Open the **AWS Console**
2. Navigate to **ECS > Task Definitions**
3. Check if the tasks are listed and ensure they have the correct configurations

### **4. (Optional) Deploy Tasks as ECS Services**

If you want to deploy the tasks to ECS, create an **ECS service** for each one using the following command:

```sh
aws ecs create-service \
  --cluster <CLUSTER_NAME> \
  --service-name <SERVICE_NAME> \
  --task-definition <TASK_NAME> \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<SUBNET_ID>],securityGroups=[<SECURITY_GROUP_ID>],assignPublicIp=ENABLED}"
```

> Replace `<CLUSTER_NAME>`, `<SERVICE_NAME>`, `<TASK_NAME>`, `<SUBNET_ID>`, and `<SECURITY_GROUP_ID>` with your actual values.

---

## **Conclusion**

Taskly is a fully containerized and scalable microservices-based application demonstrating **backend development, AWS integration, Kubernetes orchestration, and event-driven architecture**. The AWS ECS configurations serve as an example of deploying cloud-native applications but are not required for this portfolio project.
