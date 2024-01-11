import { headers, BASE_PATH } from './constant';
import { IGenre } from './genre';

export interface IMovie {
  id: number;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  title: string;
  genre_ids: number[];
  vote_count: number;
}

export interface IMovieDetail {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  genres: IGenre[];
  overview: string;
  tagline: string;
  release_date: string;
  runtime: number;
  rate: number;
  original_title: string;
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

export function getMovies(language = 'ko') {
  return fetch(`${BASE_PATH}/movie/now_playing?language=${language}`, {
    headers,
  }).then((res) => res.json());
}

export function getMovieDetail(id: number, language = 'ko') {
  return fetch(`${BASE_PATH}/movie/${id}?language=${language}`, {
    headers,
  }).then((res) => res.json());
}
