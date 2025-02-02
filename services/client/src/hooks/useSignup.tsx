import { useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "../config/axios";
import { useNavigate } from "react-router";

const useSignUp = () => {
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const signUp = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      confirmPassword: string
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          "/users/signup",

          { name, email, password, confirmPassword }
        );
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/");
      } catch (err: any) {
        setError(
          err?.response?.data?.message || err.message || "Something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setUser]
  );

  return { signUp, error, isLoading };
};

export default useSignUp;
