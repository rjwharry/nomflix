import { useSearchParams } from 'react-router-dom';

function Search() {
  const [readSearchParams] = useSearchParams();
  console.log(readSearchParams.get('keyword'));
  return null;
}

export default Search;
