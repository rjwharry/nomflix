export function makeImagePath(id: string, format?: string) {
  console.log(
    `https://image.tmdb.org/t/p/${format ? format : 'original'}/${id}`
  );
  return `https://image.tmdb.org/t/p/${format ? format : 'original'}/${id}`;
}
