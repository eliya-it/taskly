import NotificationsDlq from "./notifications-dlq";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let delay: number = 1000;
let shouldExit = false;

process.on("SIGINT", () => {
  console.log("Exiting gracefully...");
  shouldExit = true;
});

(async () => {
  const dlq = new NotificationsDlq(
    {
      region: "us-east-1",
    },
    process.env.AWS_NOTIFICATIONS_DLQ_URL!,
    process.env.AWS_NOTIFICATIONS_QUEUE_URL!
  );

  console.log("Connecting to DLQ...");
  while (!shouldExit) {
    try {
      await dlq.processDLQ();
      delay = 1000; // Reset delay
    } catch (error) {
      console.error("Error processing DLQ:", error);
    }

    await sleep(1000); // Add delay between polls
  }
})();
