# Notification Service

## Overview

The **Notification Service** listens for events from other services and sends appropriate notifications. It uses AWS SNS/SQS for event-driven communication and includes retry mechanisms with a Dead Letter Queue (DLQ).

## Features

- **Event Listener:** Subscribes to SNS topics for user and to-do events.
- **Email Sender:** Uses Nodemailer to send email notifications.
- **Dead Letter Queue (DLQ):** Stores failed messages for later processing.

## Security

- Retries failed notification deliveries before moving them to DLQ.
- Ensures secure communication between microservices.

## Dependencies

- **AWS SDK** - SNS & SQS integration.
- **Nodemailer** - For sending emails.
- **@taskly/shared** - Reusable utility functions.
