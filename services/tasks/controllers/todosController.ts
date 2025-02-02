import { AppError, CustomRequest, Subjects } from "@taskly/shared";
import Todo from "../models/todoModel";
import TodosPublisher from "./../events/todosPublisher";
import { NextFunction, Response } from "express";
import catchAsync from "@taskly/shared/build/utils/catchAsync";

interface TodoDocument {
  id: string;
  name: string;
  urgent: boolean;
  save: () => Promise<void>;
}
interface TodoUrgentPayload {
  email: string;
  name: string;
}

export const checkUrgentProperty = (
  existingDoc: TodoDocument,
  urgent: boolean,
  next: NextFunction
): void => {
  if (existingDoc.urgent === true && urgent === true) {
    next(new AppError("Todo is already marked as urgent!", 400));
  }
};

export const updateTodo = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const existingDoc = (await Todo.findByPk(
      req.params.id
    )) as TodoDocument | null;

    if (!existingDoc) {
      return next(new AppError("No document found with that ID!", 404));
    }

    checkUrgentProperty(existingDoc, req.body.urgent, next);

    // Update the document using the existingDoc
    Object.assign(existingDoc, req.body);
    await existingDoc.save();

    if (existingDoc.urgent) {
      const publisher = new TodosPublisher<TodoUrgentPayload>(
        process.env.AWS_SNS_TOPIC_ARN_TODOEVENTS!,
        process.env.AWS_SNS_TOPIC_TODOEVENTS!
      );
      await publisher.publish({
        type: Subjects.TODO_URGENT,
        payload: {
          name: existingDoc.name,
          email: req.user?.email!,
        },
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        doc: existingDoc,
      },
    });
  }
);
