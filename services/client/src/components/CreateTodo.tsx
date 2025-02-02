import React, { FunctionComponent, useState } from "react";
import useFetch from "../hooks/useFetch";
import { Loader, CheckCircle, XCircle } from "lucide-react";

interface Props {
  refreshTodos: () => Promise<void>;
}

const CreateTodo: FunctionComponent<Props> = ({ refreshTodos }) => {
  const [todoText, setTodoText] = useState("");
  const { error, isLoading, fetchData } = useFetch();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetchData(
        "/todos",
        {
          method: "POST",
          body: JSON.stringify({ name: todoText }),
        },
        true
      );
      setTodoText("");
      setSuccessMessage("Todo created successfully!");
      await refreshTodos();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to create todo", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="mr-2">📝</span> Create a New Todo
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            placeholder="Enter your todo"
            className="border border-gray-300 rounded-lg p-3 flex-grow focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={16} />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Add Todo
              </>
            )}
          </button>
        </div>
        {successMessage && (
          <div className="flex items-center text-green-600 bg-green-100 border border-green-400 rounded-lg p-3">
            <CheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}
        {error && (
          <div className="flex items-center text-red-600 bg-red-100 border border-red-400 rounded-lg p-3">
            <XCircle className="mr-2" />
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateTodo;
