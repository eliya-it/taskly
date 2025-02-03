import { FunctionComponent, useEffect } from "react";
import TodoList from "../components/TodoList";
import useFetch from "../hooks/useFetch";
import CreateTodo from "../components/CreateTodo";
import Navbar from "../components/Navbar";

const Home: FunctionComponent = () => {
  const { data: todos, error, fetchData } = useFetch();

  const fetchTodos = async (): Promise<void> => {
    await fetchData("/todos/", { method: "GET" }, true);
  };
  useEffect(() => {
    fetchTodos();
  }, [fetchData]);

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar />

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-extrabold text-center mb-6">Todo List</h1>
        <CreateTodo refreshTodos={fetchTodos} />
        <TodoList todos={todos?.data.docs} refreshTodos={fetchTodos} />
      </div>
    </>
  );
};

export default Home;
