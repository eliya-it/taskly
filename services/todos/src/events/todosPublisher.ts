import { SNSClientConfig } from "@aws-sdk/client-sns";
import { Publisher } from "@taskly/shared";
interface Event {
  topic: string;
  data: any;
}
class TodosPublisher<TPayload = unknown> extends Publisher<TPayload> {
  constructor(topicArn: string, topic: string) {
    super(
      {
        region: "us-east-1",
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

export default TodosPublisher;
