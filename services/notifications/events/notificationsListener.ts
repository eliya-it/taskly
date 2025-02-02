import { Listener } from "@taskly/shared";
import { Subjects } from "@taskly/shared";
import { sendEmail } from "../utils/email";
import AppError from "@taskly/shared/build/utils/appError";
interface Event {
  topic: string;
  data: { title: string; description: string };
  Message: string;
  MessageAttributes?: MessageAttributes;
}
interface EventMap {
  [Subjects.Todo_Created]: { title: string; description: string };
  [Subjects.TODO_URGENT]: { email: string; name: string };
  [Subjects.USER_CREATED]: { email: string; name: string };
  [Subjects.USER_DELETED]: { email: string };
}

interface ParsedMessage {
  topic: string;
  payload: any;
  type?: string;
}

interface MessageAttributes {
  RetryCount?: { StringValue: string };
}

interface EventMessage {
  Message: string;
  MessageAttributes?: MessageAttributes;
  data: { title: string; description: string };
}

class NotificationsListener extends Listener<Event> {
  constructor(queueUrl: string, topic: string, dlqUrl: string) {
    super(
      {
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      },
      queueUrl,
      topic,
      dlqUrl
    );
  }

  async handleEvent<T extends keyof EventMap>(
    event: EventMessage
  ): Promise<void> {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Message processing timed out")), 3000)
    );

    const retryCount = event.MessageAttributes?.RetryCount
      ? parseInt(event.MessageAttributes.RetryCount.StringValue, 10)
      : 0;

    if (retryCount >= 3) {
      console.error("Exceeded retry limit", event);
      return; // Skip further retries for this message
    }

    if (!event.Message) {
      console.error("Empty message body");
      return; // Skip processing
    }

    const messageSize = Buffer.byteLength(event.Message, "utf8");
    if (messageSize > 1024 * 1024) {
      // 1 MB limit
      console.error("Message size exceeded", messageSize);
      return; // Skip processing
    }

    try {
      await Promise.race([
        (async () => {
          const parsedMessage: ParsedMessage = JSON.parse(event.Message);

          if (!parsedMessage.topic) {
            console.error("Unexpected message structure", parsedMessage);
            return; // Skip processing
          }

          if (
            !Object.values(Subjects).includes(
              parsedMessage.topic as keyof typeof Subjects
            )
          ) {
            console.error("Invalid topic", parsedMessage.topic);
            return;
          }

          if (!parsedMessage.payload) {
            console.error("Message does not have a payload");
            return;
          }

          switch (parsedMessage.topic) {
            case Subjects.USER_CREATED:
              sendEmail(
                parsedMessage.payload.email,
                "Welcome to Taskly!",
                "Your account has been created!"
              );
              break;

            case Subjects.USER_DELETED:
              sendEmail(
                parsedMessage.payload.email,
                "Goodbye",
                "We are sorry to see you go :("
              );
              break;

            case Subjects.TODO_URGENT:
              sendEmail(
                parsedMessage.payload.email,
                "Urgent Todo",
                `We have noticed your alert about ${parsedMessage.payload.name} todo`
              );
              break;

            default:
              console.warn(`Unhandled event topic: ${parsedMessage.topic}`);
          }
        })(),
        timeout, // Timeout will trigger if processing takes too long
      ]);
    } catch (error) {
      console.error("Malformed message JSON", error);
    }
  }
}

export default NotificationsListener;
