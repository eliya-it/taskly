import { FormEvent, FunctionComponent, useState } from "react";
import Message from "./Message";

interface Props {
  onLogin: (email: string, password: string) => Promise<void>;
  loginError: string | null;
  isLoading: boolean;
}

const LoginForm: FunctionComponent<Props> = ({
  onLogin,
  loginError,
  isLoading,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "email":
        return !value || !value.includes("@") ? "Invalid email address" : "";
      case "password":
        return !value || value.length < 8
          ? "Password must be at least 8 characters long"
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }

    const error = validateField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      email: validateField("email", email),
      password: validateField("password", password),
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const loginHandler = async function (e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateForm()) {
      onLogin(email, password);
    }
  };

  return (
    <>
      <form onSubmit={loginHandler}>
        {loginError && <Message message={loginError} />}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-4 py-2 mt-1 border border-gray-300 rounded-md ${
              errors.email ? "border-red-500" : ""
            }`}
            required
          />
          {errors.email && (
            <div className="text-red-500 text-sm mt-1">{errors.email}</div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={`w-full px-4 py-2 mt-1 border border-gray-300 rounded-md ${
              errors.password ? "border-red-500" : ""
            }`}
            required
          />
          {errors.password && (
            <div className="text-red-500 text-sm mt-1">{errors.password}</div>
          )}
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-2 mt-4 text-white rounded-md ${
            isLoading || Object.values(errors).some((error) => error)
              ? "bg-gray-400"
              : "bg-blue-500"
          }`}
          disabled={isLoading || Object.values(errors).some((error) => error)}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
