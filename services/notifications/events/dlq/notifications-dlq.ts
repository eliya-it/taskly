import { SQSClientConfig } from "@aws-sdk/client-sqs";
import { Dlq } from "@taskly/shared";

class NotificationsDlq extends Dlq {
  constructor(
    options: SQSClientConfig,
    dlqUrl: string,
    queueUrl: string,
    maxRetries = 5
  ) {
    super(options, dlqUrl, queueUrl, maxRetries);
  }
}

export default NotificationsDlq;
