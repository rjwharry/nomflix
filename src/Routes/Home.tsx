import { useQuery } from '@tanstack/react-query';
import { IGetMoviesResult, getMovies } from '../api/movie';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { AnimatePresence, Variants, motion, useScroll } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import MovieDetail from '../Components/MovieDetail';
import { IGenreResult, getGenres } from '../api/genre';

const Wrapper = styled.div`
  background: black;
  height: 200vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  text-align: center;
  justify-content: center;
`;

const Banner = styled.div<{ bgimage: string }>`
  height: 100vh;
  padding: 10% 60px 60px 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgimage});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 25px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -20%;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  display: flex;
  align-items: center;
  height: 200px;
  &:last-child {
    transform-origin: center right;
  }
  &:first-child {
    transform-origin: center left;
  }
`;

const BoxTitle = styled.div`
  padding: 10px;
  background: transparent;
  width: 100%;
  h4 {
    text-align: center;
    font-size: 24px;
    font-weight: bolder;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: space-between;
`;

const GenreUl = styled.ul`
  display: block;
  list-style-type: square;
`;
const GenreItem = styled.li`
  margin-right: 10px;
  display: inline-block;
  font-size: 13px;
`;

const rowVariants: Variants = {
  hidden: {
    x: window.innerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth,
  },
};

const boxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.5,
    transition: {
      delay: 0.5,
    },
  },
};

const infoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
    },
  },
};

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const movieDetailMatch = useMatch('/movies/:movieId');
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>({
    queryKey: ['movies', 'now playing'],
    queryFn: () => getMovies(),
  });
  const { data: genreList } = useQuery<IGenreResult>({
    queryKey: ['genre', 'list'],
    queryFn: () => getGenres(),
  });
  const [idx, setIdx] = useState(0);
  const [sliderLeaving, setSliderLeaving] = useState(false);
  const increaseIdx = () => {
    if (sliderLeaving) return;
    if (data) {
      const totalMovies = data.results.length - 1;
      const maxIdx = Math.ceil(totalMovies / offset);
      setIdx((prev) => (prev + 1) % maxIdx);
    }
    toggleSliderLeaving();
  };
  const toggleSliderLeaving = () => setSliderLeaving((prev) => !prev);
  const onBoxClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const detailMovie = movieDetailMatch?.params.movieId
    ? data?.results.find(
        (movie) => movie.id + '' === movieDetailMatch?.params.movieId
      )
    : undefined;
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIdx}
            bgimage={makeImagePath(data?.results[0].backdrop_path || '')}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleSliderLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={idx}
                transition={{ type: 'tween', duration: 1 }}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * idx, offset * idx + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      layoutId={movie.id + ''}
                      onClick={() => onBoxClick(movie.id)}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      transition={{
                        type: 'tween',
                        duration: 0.2,
                      }}
                      bgphoto={makeImagePath(movie.backdrop_path, 'w500')}
                    >
                      <BoxTitle>
                        <h4>{movie.title}</h4>
                      </BoxTitle>
                      <Info variants={infoVariants}>
                        <GenreUl>
                          {movie.genre_ids.map((id) => (
                            <GenreItem key={id}>
                              {
                                genreList?.genres.find(
                                  (genre) => genre.id === id
                                )?.name
                              }
                            </GenreItem>
                          ))}
                        </GenreUl>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {movieDetailMatch ? (
              <MovieDetail movieId={detailMovie?.id} scrollY={scrollY.get()} />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
