import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = "1912bdd8";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(function () {
  //   const storageValue = localStorage.getItem("watched"); //key
  //   return JSON.parse(storageValue);
  // });

  /*
  useEffect(function () {
    console.log("Only After initaial Mount/render");
  }, []);

  useEffect(function () {
    console.log("After Every RENDER");
  });
  useEffect(
    function () {
      console.log("After Every change in Query  state");
    },
    [query]
  );

  console.log("During Render");
*/
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID != id));
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleSelectMoive(id) {
    //double clk the same moive(first time it opens & second time it closes)
    setSelectedId((currId) => (currId === id ? null : id));
  }
  function handleCloseMoive() {
    setSelectedId(null);
  }
  //Stroig to local Storge
  // useEffect(
  //   function () {
  //     localStorage.setItem("watched", JSON.stringify(watched));
  //   },
  //   [watched]
  // );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loading /> : <MoiveList movies={movies} />} */}
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MoiveList movies={movies} onSelectMoive={handleSelectMoive} />
          )}
          {error && <ErrorMsg message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMoive}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMsg({ message }) {
  return (
    <p className="error">
      <span>😩</span> {message}
    </p>
  );
}
function Loading() {
  return <p className="loader"> Loading....</p>;
}
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  //to input the focus on search bar
  const inputEle = useRef(null);

  useEffect(
    function () {
      // console.log(inputEle.current)

      function callBack(e) {
        if (document.activeElement === inputEle.current) return;

        if (e.code === "Enter") {
          inputEle.current.focus();
          setQuery("");
        }
      }
      document.addEventListener("keydown", callBack);
      return () => document.addEventListener("keydown", callBack);
    },
    [setQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEle}
    />
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong> {movies.length} </strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MoiveList({ movies, onSelectMoive }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Moive key={movie.imdbID} movie={movie} onSelectMoive={onSelectMoive} />
      ))}
    </ul>
  );
}
function Moive({ movie, onSelectMoive }) {
  return (
    //Selecting a particular Moive(its ID-->name from the obj) from the List.()
    <li onClick={() => onSelectMoive(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  //to know how many time the user is updating(clickin) the rating before final selection of rating
  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating)
        countRef.current = countRef.current = countRef.current + 1;
    },
    [userRating]
  );
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Diretr: director,
    Genre: genre,
  } = movie;
  // console.log(movie);

  function handleAdd() {
    const newwatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime,
      userRating,
      contRatingDecisions: countRef.current,
    };
    console.log(newwatchedMovie);

    onAddWatched(newwatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      function callBack(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
        document.addEventListener("keydown", callBack);

        return function () {
          document.removeEventListener("keydown", callBack);
        };
      }
    },
    [onCloseMovie]
  );
  useEffect(
    function () {
      async function getMoiveDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMoiveDetails();
    },
    [selectedId]
  );

  //to change title in browser(Aside of favion)->since its outsidethe application we(Side Effect) we are going to use useEfect
  useEffect(
    function () {
      if (!title) return;

      document.title = `Movie | ${title}`;
      //CleanUp Function
      return function () {
        document.title = "UsePopCorn";
      };
    },
    [title]
  );
  //console.log(title, year);
  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              ⬅
            </button>
            <img src={poster} alt={`Poster of ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre} </p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={30}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + AddMoive
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this Movie {watchedUserRating} 🌟 </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors} </p>
            <p>Directed by {director} </p>
          </section>
        </>
      )}
    </div>
  );
}

/*function WatchedBox() {
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && <></>}
    </div>
  );
}*/

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMoive
          key={movie.imdbID}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMoive({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          -
        </button>
      </div>
    </li>
  );
}
