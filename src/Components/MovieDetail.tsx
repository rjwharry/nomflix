import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { IMovie } from '../api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

interface MovieDetailProps {
  movie: IMovie | undefined;
  scrollY: number;
}

function MovieDetail({ movie }: MovieDetailProps) {
  const navigate = useNavigate();
  const onOverlayClick = () => navigate('/');
  return (
    <>
      <Overlay
        onClick={onOverlayClick}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <MovieDetailModal
        layoutId={movie?.id + ''}
        style={{
          top: scrollY + 50,
        }}
      >
        {movie && (
          <>
            <MovieDetailCover
              bgImage={makeImagePath(movie.backdrop_path, 'w500')}
            />
            <MovieDetailBody>
              <MovieDetailTitle>{movie.title}</MovieDetailTitle>
              <MovieDetailOverview>{movie.overview}</MovieDetailOverview>
            </MovieDetailBody>
          </>
        )}
      </MovieDetailModal>
    </>
  );
}

export default MovieDetail;
