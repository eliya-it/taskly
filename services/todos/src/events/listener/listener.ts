import TodosListener from "./todos-listener";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const listener = new TodosListener(
    {
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    },
    process.env.AWS_SQS_TODOS_QUEUE!,
    "UserEvents"
  );

  while (true) {
    await listener.pollEvents();
    await sleep(1000); // Add a 1-second delay between polls
  }
})();
