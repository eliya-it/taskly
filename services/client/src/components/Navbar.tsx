import React, { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useLogout();
  const logoutHandler = function (e: FormEvent) {
    e.preventDefault();
    logout();
  };
  return (
    <nav className="bg-grey-900 text-white p-1 flex justify-between items-center shadow-md md:p-2 lg:p-3">
      <Link to="/" className="text-2xl font-bold tracking-wider">
        <span className="text-orange-500">Task</span>
        <span className="text-yellow-500">ly</span>
      </Link>
      <div className="md:flex hidden space-x-4">
        <Link
          to="/todos"
          className="text-sm font-medium hover:text-blue-500 transition duration-300"
        >
          Todos
        </Link>
        <button
          className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition duration-300 shadow-md"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>
      <button
        className="md:hidden flex justify-center w-8 h-8 bg-gray-600 hover:bg-gray-700 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
      {isOpen && (
        <div className="md:hidden flex flex-col absolute top-16 right-4 bg-blue-900 p-4 rounded-lg shadow-md w-48">
          <Link
            to="/todos"
            className="text-sm font-medium hover:text-blue-500 transition duration-300"
          >
            Todos
          </Link>
          <button
            className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition duration-300 shadow-md"
            onClick={logoutHandler}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
