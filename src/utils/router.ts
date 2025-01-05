import { useLoaderData as useRouterLoaderData } from "react-router-dom";
import { RouterLoader } from "../routes/routes.types";
import { useEffect, useState } from "react";

export function useLoaderData<T>() {
  return useRouterLoaderData() as RouterLoader<T>;
}

export function useLoaderApi<T>() {
  const loaderData = useRouterLoaderData() as RouterLoader<T>;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    loaderData.data
      .then((response) => {
        setData(response);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading, isError };
}
