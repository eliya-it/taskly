import { createOne, deleteOne, getAll, protect } from "@taskly/shared";
import express from "express";
import { updateTodo } from "../controllers/todosController";
import Todo from "../models/todoModel";

const router = express.Router();
router.use(protect("http://users-srv:5000/api/users"));
router.route("/").get(getAll(Todo)).post(createOne(Todo));

router.route("/:id").delete(deleteOne(Todo)).patch(updateTodo);

export default router;
