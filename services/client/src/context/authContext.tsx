import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import useFetch from "../hooks/useFetch";

export interface User {
  id: string;
  name: string;
  email?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { data, error, fetchData } = useFetch();

  useEffect(() => {
    const validateToken = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user")!);
      if (!storedUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { token } = storedUser;

      if (token) {
        fetchData(
          "/users/validateToken",
          {
            method: "GET",
          },
          true
        );
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };

    validateToken();
  }, [fetchData]);

  useEffect(() => {
    if (data && data.status === "success") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.name,
          token: data.token,
          userId: data.userId,
        })
      );

      setIsLoading(false);
      setUser({
        name: data.name,
        token: data.token,
        id: data.userId,
      });
    }

    if (error) {
      setUser(null);
      setIsLoading(false);
    }
  }, [data, error]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
