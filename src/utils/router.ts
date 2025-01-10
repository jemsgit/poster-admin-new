import { useLoaderData as useRouterLoaderData } from "react-router-dom";
import { RouterLoader } from "../routes/routes.types";
import { useEffect, useState } from "react";

type LoaderApiResult<T> =
  | { data: T; isLoading: false; isError: false }
  | { data: null; isLoading: true; isError: false }
  | { data: null; isLoading: false; isError: true };

export function useLoaderData<T>() {
  return useRouterLoaderData() as RouterLoader<T>;
}

export function useLoaderApi<T>(): LoaderApiResult<T> {
  const loaderData = useRouterLoaderData() as RouterLoader<T>;

  const [data, setData] = useState<LoaderApiResult<T>>({
    data: null,
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    loaderData.data
      .then((response) => {
        setData({
          data: response,
          isLoading: false,
          isError: false,
        });
      })
      .catch(() => {
        setData({
          data: null,
          isLoading: false,
          isError: true,
        });
      });
  }, []);

  return data;
}
