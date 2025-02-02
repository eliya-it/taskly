import { CustomRequest } from "@taskly/shared";
import { NextFunction, Request, Response } from "express";

jest.mock("@taskly/shared", () => ({
  initializeSequelize: jest.fn().mockReturnValue({}),
  getModel: jest.fn().mockReturnValue({}),
  getAll: jest.fn().mockReturnValue((req: Request, res: Response) => {
    const todos = [
      { id: 1, name: "Test Todo 1", urgent: false },
      { id: 2, name: "Test Todo 2", urgent: true },
    ];
    res.status(200).json({ status: "success", data: { docs: todos } });
  }),
  createOne: jest
    .fn()
    .mockImplementation((Model) => async (req: Request, res: Response) => {
      try {
        const doc = await Model.create(req.body);
        res.status(201).json({ status: "success", data: { doc } });
      } catch (error: any) {
        res.status(400).json({ status: "fail", message: error.message });
      }
    }),
  deleteOne: jest
    .fn()
    .mockImplementation((Model) => async (req: Request, res: Response) => {
      const { id } = req.params;
      if (id === "1") {
        res
          .status(200)
          .json({ status: "success", message: "Todo deleted successfully" });
      } else {
        res.status(404).json({ status: "fail", message: "Todo not found" });
      }
    }),
  Publisher: jest.fn().mockImplementation(() => ({})),
  protect: jest
    .fn()
    .mockReturnValue(
      (req: CustomRequest, res: Response, next: NextFunction) => {
        req.user = { id: "test-user-id", email: "test@test.com" };
        next();
      }
    ),
  errorController: jest
    .fn()
    .mockImplementation(() => (err: any, req: Request, res: Response) => {
      res.status(500).json({ status: "error", message: err.message });
    }),
  notFound: jest.fn().mockImplementation((req: Request, res: Response) => {
    res.status(404).json({ status: "fail", message: "Not Found" });
  }),
}));
