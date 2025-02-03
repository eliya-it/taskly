import { Listener, Subjects } from "@taskly/shared";
import { SQSClient, SQSClientConfig } from "@aws-sdk/client-sqs";

import Todo from "../../models/todoModel";

interface Event {
  topic: string;
  data: any;
  Message: string;
}

class TodosListener extends Listener<Event> {
  protected queueUrl: string;

  constructor(sqsOptions: SQSClientConfig, queueUrl: string, topic: string) {
    super(sqsOptions, queueUrl, topic);
    this.queueUrl = queueUrl;
  }

  async handleEvent(event: Event): Promise<void> {
    try {
      const parsedMessage = JSON.parse(event.Message);

      if (parsedMessage.type === Subjects.USER_DELETED) {
        const { id } = parsedMessage.payload;

        if (id) {
          await Todo.destroy({ where: { userId: id.toString() } });
        }
      }
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
}

export default TodosListener;
