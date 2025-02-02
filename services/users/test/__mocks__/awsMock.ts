import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";

AWSMock.setSDKInstance(AWS);

// Track mocked services
const mockedServices = new Set<string>();

// Mock SQS
AWSMock.mock("SQS", "sendMessage", (params, callback) => {
  callback(null, { MessageId: "mock-message-id" });
});
mockedServices.add("SQS");

AWSMock.mock("SQS", "receiveMessage", (params, callback) => {
  callback(null, {
    Messages: [{ Body: "mock-message-body", MessageId: "mock-message-id" }],
  });
});
mockedServices.add("SQS");

// Mock SNS
AWSMock.mock("SNS", "publish", (params, callback) => {
  callback(null, { MessageId: "mock-sns-message-id" });
});
mockedServices.add("SNS");

// Mock CloudWatch Logs
AWSMock.mock("CloudWatchLogs", "putLogEvents", (params, callback) => {
  callback(null, { nextSequenceToken: "mock-sequence-token" });
});
mockedServices.add("CloudWatchLogs");

// Cleanup function to restore AWS services only if they were mocked
export const restoreAWSMocks = () => {
  mockedServices.forEach((service) => {
    try {
      AWSMock.restore(service);
    } catch (error) {
      console.warn(`Skipping restore: ${service} was not mocked.`);
    }
  });
};

console.log("AWS services mocked!");
