import NotificationsListener from "./src/events/notificationsListener";

// Helper function to pause execution for a specified time
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const queueUrl = process.env.AWS_NOTIFICATIONS_QUEUE_URL;
  const dlqUrl = process.env.AWS_NOTIFICATIONS_DLQ_URL;
  const snsTopic = process.env.AWS_SNS_TOPIC_USEREVENTS;

  if (!queueUrl || !snsTopic || !dlqUrl) {
    console.error(
      "Error: Missing environment variables for queue URL or SNS topic."
    );
    process.exit(1);
  }

  const listener = new NotificationsListener(queueUrl, snsTopic, dlqUrl);

  console.log("Starting notifications listener...");

  while (true) {
    try {
      await listener.pollEvents();
      await sleep(1000); // Wait for 1 second before polling again
    } catch (error) {
      console.error("Error while polling events:", (error as Error).message);
    }
  }
})();
