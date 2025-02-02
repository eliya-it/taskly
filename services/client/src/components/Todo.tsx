import React, { useState } from "react";
import useFetch from "../hooks/useFetch";

type TodoProps = {
  id: number;
  createdAt: string;
  todo: string;
  status: string;
  onUpdate: (id: number, newTask: string) => Promise<void>;
  onUpdateStatus: () => void;
  refreshTodos: () => Promise<void>;
};

const Todo: React.FC<TodoProps> = ({
  id,
  createdAt,
  todo,
  status,
  onUpdate,
  refreshTodos,
}) => {
  const { fetchData } = useFetch();

  const [isEditing, setIsEditing] = useState(false);
  const [newTask, setNewTask] = useState(todo);

  const handleEdit = () => setIsEditing(true);

  const handleBlur = () => {
    setIsEditing(false);
    if (newTask !== todo) {
      onUpdate(id, newTask);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  const handleStatusChange = async () => {
    const newStatus = status === "finished" ? "not-started" : "finished";
    await fetchData(
      `/todos/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      },
      true
    );
    await refreshTodos();
  };

  const handleDelete = async () => {
    await fetchData(
      `/todos/${id}`,
      {
        method: "DELETE",
      },
      true
    );
    await refreshTodos();
  };

  return (
    <div className="relative p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Date at the top-right */}
      <span className="absolute top-3 right-3 text-xs text-gray-500">
        {new Date(createdAt).toLocaleDateString()}
      </span>

      {/* Checkbox to toggle completion */}
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="checkbox"
          checked={status === "finished"}
          onChange={handleStatusChange}
          className="w-5 h-5 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
        />
        {isEditing ? (
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full p-3 text-sm bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        ) : (
          <div onClick={handleEdit} className="cursor-pointer">
            <h3
              className={`font-semibold text-lg text-gray-800 ${
                status === "finished" ? "line-through text-gray-500" : ""
              }`}
            >
              {todo}
            </h3>
          </div>
        )}
      </div>

      {/* Status and Delete Icon */}
      <div className="flex items-center justify-between space-x-4 mt-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {status}
        </span>
        <div
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={handleDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Todo;
