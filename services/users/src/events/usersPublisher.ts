import { SNSClientConfig } from "@aws-sdk/client-sns";
import { Publisher } from "@taskly/shared";
interface Event {
  topic: string;
  data: any;
}

class UsersPublisher<TPayload = unknown> extends Publisher<TPayload> {
  constructor(topicArn: string, topic: string) {
    super(
      {
        region: process.env.AWS_REGION!,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      },
      topicArn,
      topic
    );
  }
}

export default UsersPublisher;
