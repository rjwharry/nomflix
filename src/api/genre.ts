import { API_ACCESS_TOKEN, BASE_PATH } from './constant';

export interface IGenre {
  id: number;
  name: string;
}

export interface IGenreResult {
  genres: IGenre[];
}

export function getGenres(language = 'ko') {
  return fetch(`${BASE_PATH}/genre/movie/list?language=${language}`, {
    headers: {
      Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      accept: 'application/json',
    },
  }).then((res) => res.json());
}
