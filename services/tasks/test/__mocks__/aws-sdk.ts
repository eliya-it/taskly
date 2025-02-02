jest.mock("aws-sdk", () => {
  return {
    config: {
      update: jest.fn(),
    },
    CloudWatch: jest.fn().mockImplementation(() => {
      return {
        putMetricData: jest.fn(() => {
          return { promise: () => Promise.resolve({}) };
        }),
      };
    }),
    Credentials: jest.fn().mockImplementation(() => {
      return {
        accessKeyId: "mock-access-key",
        secretAccessKey: "mock-secret-key",
      };
    }),
  };
});
