//creating a Custom hook(using the named exports) -->FetchMovies

import { useState, useEffect } from "react";
const key = "1912bdd8";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);

          setError(""); //Reset The error everyTime (Before the data is being Fetched )

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );

          //if any netwrok issue happens in midde of fetch
          if (!res.ok)
            throw new Error("SomeThing went wrong while Fetching movies");

          const data = await res.json();
          //if desired reslts are not Fetched out
          if (data.Response === "False") throw new Error("Moives Not Found");

          setMovies(data.Search);

          //console.log(data.Search);
          setError("");
        } catch (err) {
          console.error(err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      //codition Check if(Nothing is Searched/ char in searchBar < n) return without calling the function
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return; // wont  call the below fun to fetch Movies/simply returns
      }
      fetchMovies();

      //clean Up Function(Extected B/W renders)
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
