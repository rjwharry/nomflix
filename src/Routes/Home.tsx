import { useQuery } from '@tanstack/react-query';
import { IGetMoviesResult, getMovies } from '../api';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { AnimatePresence, Variants, motion, useScroll } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';

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

const Banner = styled.div<{ bgImage: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgImage});
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
  top: -250px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  &:last-child {
    transform-origin: center right;
  }
  &:first-child {
    transform-origin: center left;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const MovieDetailModal = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const MovieDetailCover = styled.div<{ bgImage?: string }>`
  width: 100%;
  height: 300px;
  background-image: linear-gradient(0deg, black, transparent),
    url(${(props) => props.bgImage});
  background-size: cover;
  background-position: center center;
`;

const MovieDetailBody = styled.div`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -40px;
`;

const MovieDetailTitle = styled.h2`
  font-size: 36px;
  padding-left: 20px;
`;

const MovieDetailOverview = styled.p`
  padding: 20px;
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
    scale: 1.3,
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
  const movieModal = useMatch('/movies/:movieId');
  const { data, isLoading } = useQuery<IGetMoviesResult>({
    queryKey: ['movies', 'now playing'],
    queryFn: getMovies,
  });
  const { scrollY } = useScroll();
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
  const onOverlayClick = () => navigate('/');
  const detailMovie =
    movieModal?.params.movieId &&
    data?.results.find((movie) => movie.id + '' === movieModal?.params.movieId);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIdx}
            bgImage={makeImagePath(data?.results[0].backdrop_path || '')}
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
                      bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {movieModal ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <MovieDetailModal
                  layoutId={movieModal?.params.movieId}
                  style={{
                    top: scrollY.get() + 50,
                  }}
                >
                  {detailMovie && (
                    <>
                      <MovieDetailCover
                        bgImage={makeImagePath(
                          detailMovie.backdrop_path,
                          'w500'
                        )}
                      />
                      <MovieDetailBody>
                        <MovieDetailTitle>{detailMovie.title}</MovieDetailTitle>
                        <MovieDetailOverview>
                          {detailMovie.overview}
                        </MovieDetailOverview>
                      </MovieDetailBody>
                    </>
                  )}
                </MovieDetailModal>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
