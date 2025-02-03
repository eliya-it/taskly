import { AxiosHeaders, AxiosRequestConfig } from "axios";
import axios from "../config/axios";
import { useCallback, useState } from "react";

const useFetch = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (url: string, options: RequestInit, isProtected: boolean = false) => {
      setIsLoading(true);
      setError(null);
      const user = localStorage.getItem("user");
      const jwt = user ? JSON.parse(user)?.token : null;
      const headers = new AxiosHeaders({
        "Content-Type": "application/json",
        ...(isProtected && jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      });

      const { body, signal, ...restOptions } = options; // Extract signal to avoid type conflicts

      const mergedOptions: AxiosRequestConfig = {
        ...restOptions, // This now only includes compatible fields
        headers,
        data: body ?? undefined, // Convert Fetch API's body to Axios' `data`
      };

      try {
        const response = await axios(url, mergedOptions);
        setData(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { data, error, isLoading, fetchData };
};

export default useFetch;
