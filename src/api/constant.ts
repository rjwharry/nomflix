export const API_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNDg4OTg4MzVlNTBlNTY3Yzk1MzQxNmQ5OTY2OGQ0NyIsInN1YiI6IjY1OTQxNzVmZWJiOTlkNWUxN2EwNDA5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Df74-FnAmd88FrRaWUqosxYM7dMcIzFWmH5XuJh8IFA';
export const BASE_PATH = 'https://api.themoviedb.org/3/';

export const headers = {
  Authorization: `Bearer ${API_ACCESS_TOKEN}`,
  accept: 'application/json',
};
