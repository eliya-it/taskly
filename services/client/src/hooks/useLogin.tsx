import { useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import axios from "../config/axios";

const useLogin = () => {
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post("/users/login", {
          email,
          password,
        });

        if (response.data.status === "success") {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
          navigate("/");
        } else {
          return setError(response.data.message);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [setUser]
  );

  return { login, error, isLoading };
};

export default useLogin;
