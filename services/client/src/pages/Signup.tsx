import { Link, useNavigate } from "react-router";
import useSignUp from "../hooks/useSignup";
import SignupForm from "../components/SignupForm";

const Signup = () => {
  const { signUp, error, isLoading } = useSignUp();

  const handleSignup = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    await signUp(name, email, password, confirmPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Signup</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <SignupForm isLoading={isLoading} onSignup={handleSignup} />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
