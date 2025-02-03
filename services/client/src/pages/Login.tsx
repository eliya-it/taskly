import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import LoginForm from "../components/LoginForm";
import { FunctionComponent } from "react";

const Login: FunctionComponent = () => {
  const { login, error, isLoading } = useLogin();

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        <LoginForm
          onLogin={handleLogin}
          isLoading={isLoading}
          loginError={error}
        />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
