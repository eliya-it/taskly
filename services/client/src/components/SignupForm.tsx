import { FormEvent, FunctionComponent, useState } from "react";

interface Props {
  onSignup: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  isLoading: boolean;
}

const SignupForm: FunctionComponent<Props> = ({ onSignup, isLoading }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "name":
        if (!value) {
          return "Name is required";
        }
        return "";
      case "email":
        if (!value || !value.includes("@")) {
          return "Invalid email address";
        }
        return "";
      case "password":
        if (!value || value.length < 8) {
          return "Password must be at least 8 characters long";
        }
        return "";
      case "confirmPassword":
        if (!value || value !== password) {
          return "Passwords do not match";
        }
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }

    const error = validateField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", name),
      email: validateField("email", email),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const signupHandler = async function (e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateForm()) {
      onSignup(name, email, password, confirmPassword);
    }
  };

  return (
    <form onSubmit={signupHandler}>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={`w-full px-4 py-2 mt-1 border border-gray-300 rounded-md ${
            errors.name ? "border-red-500" : ""
          }`}
          required
        />
        {errors.name && (
          <div className="text-red-500 text-sm mt-1">{errors.name}</div>
        )}
      </div>

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

      <div className="mb-4">
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          className={`w-full px-4 py-2 mt-1 border border-gray-300 rounded-md ${
            errors.confirmPassword ? "border-red-500" : ""
          }`}
          required
        />
        {errors.confirmPassword && (
          <div className="text-red-500 text-sm mt-1">
            {errors.confirmPassword}
          </div>
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
        {isLoading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignupForm;
