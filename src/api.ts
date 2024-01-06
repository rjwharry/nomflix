const API_KEY = '148898835e50e567c953416d99668d47';
const API_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNDg4OTg4MzVlNTBlNTY3Yzk1MzQxNmQ5OTY2OGQ0NyIsInN1YiI6IjY1OTQxNzVmZWJiOTlkNWUxN2EwNDA5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Df74-FnAmd88FrRaWUqosxYM7dMcIzFWmH5XuJh8IFA';
const BASE_PATH = 'https://api.themoviedb.org/3/';

export interface IMovie {
  id: number;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  title: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  results: IMovie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing`, {
    headers: {
      Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      accept: 'application/json',
    },
  }).then((res) => res.json());
}
