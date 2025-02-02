import React from "react";
import useFetch from "../hooks/useFetch";
import Todo from "./Todo";

type TodoItem = {
  id: number;
  name: string;
  createdAt: string;
  status: string;
};

interface TodoListProps {
  todos: TodoItem[];
  refreshTodos: () => Promise<void>;
}

interface FetchResponse {
  fetchData: (
    url: string,
    options: RequestInit,
    update?: boolean
  ) => Promise<any>;
  isLoading: boolean;
  error: any;
}

const TodoList: React.FC<TodoListProps> = ({ todos, refreshTodos }) => {
  const { fetchData, isLoading, error }: FetchResponse = useFetch();

  const handleUpdate = async (id: number, newTask: string) => {
    await fetchData(
      `/todos/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ name: newTask }),
      },
      true
    );
    if (!isLoading && !error) {
      await refreshTodos();
    }
  };

  const columns = ["not-started", "finished"];
  const handleUpdateStatus = async () => {
    await refreshTodos();
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between space-x-4">
          {columns.map((column) => {
            const filteredTodos = todos?.filter(
              (todo) => todo.status === column
            );
            return (
              <div
                key={column}
                className="flex-1 bg-white p-4 rounded-lg shadow-md"
              >
                <h2 className="text-lg font-medium text-center">
                  {column === "not-started"
                    ? "Not Started"
                    : column === "in-progress"
                    ? "In Progress"
                    : "finished"}
                </h2>
                <div className="space-y-4 mt-4">
                  {filteredTodos?.map((todo) => (
                    <Todo
                      key={todo.id}
                      id={todo.id}
                      createdAt={todo.createdAt}
                      todo={todo.name}
                      status={todo.status}
                      onUpdate={handleUpdate}
                      refreshTodos={refreshTodos}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
