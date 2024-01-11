import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { IMovieDetail, getMovieDetail } from '../api/movie';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

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
  width: 55vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const MovieDetailCover = styled.div<{ bgimage?: string }>`
  position: relative;
  width: 100%;
  height: 60%;
  background-image: linear-gradient(0deg, black, transparent),
    url(${(props) => props.bgimage});
  background-size: cover;
  background-position: center;
`;

const MovieDetailBody = styled.div`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -130px;
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
  padding-left: 40px;
`;

const MoviePoster = styled.div<{ bgimage: string }>`
  width: 200px;
  height: 350px;
  padding-left: 30px;
  background-image: url(${(props) => props.bgimage});
  background-position: center;
  background-size: cover;
  border-radius: 15px;
  position: relative;
  top: -30px;
`;

const MovieInfo = styled.div`
  padding-left: 15px;
  font-weight: 150;
`;

const MovieDetailTitle = styled.div`
  position: absolute;
  top: 10%;
  h1 {
    font-size: 36px;
    font-weight: 600;
  }
  h4 {
    font-size: 16px;
    font-weight: 400;
  }
`;

const MovieDetailInfo = styled.div`
  position: absolute;
  top: 50%;
  font-size: 14px;
`;

const MovieMetadata = styled.ul`
  display: flex;
`;

const MovieTagLine = styled.div`
  display: flex;
  align-items: center;
  /* border-left: 3px solid ${(props) => props.theme.white.lighter}; */
  margin-top: 10px;
  margin-bottom: 10px;
  min-height: 20px;
`;

const TagLiner = styled.div`
  width: 7px;
  min-height: 20px;
  border-left: 2px solid ${(props) => props.theme.white.lighter};
`;

const MovieMetadataItem = styled.li`
  display: flex;
  align-items: center;
`;

const Separator = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #ccc;
  margin-left: 20px;
  margin-right: 20px;
`;

const MovieDetailOverview = styled.div`
  width: 80%;
  overflow: visible;
  line-height: 1.5;
  min-height: 70px;
`;

interface MovieDetailProps {
  movieId: number | undefined;
  scrollY: number;
}

function MovieDetail({ movieId, scrollY }: MovieDetailProps) {
  const navigate = useNavigate();
  const onOverlayClick = () => navigate('/');
  const { data: movie, isLoading } = useQuery<IMovieDetail>({
    queryKey: ['movie', 'detail'],
    queryFn: () => getMovieDetail(movieId ?? 0),
  });
  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <Overlay
            onClick={onOverlayClick}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <MovieDetailModal
            layoutId={movieId + ''}
            style={{
              top: scrollY + 50,
            }}
          >
            {movie && (
              <>
                <MovieDetailCover
                  bgimage={makeImagePath(movie.backdrop_path, 'w500')}
                />
                <MovieDetailBody>
                  <MoviePoster
                    bgimage={makeImagePath(movie.poster_path, 'w200')}
                  />
                  <MovieInfo>
                    <MovieDetailTitle>
                      <h1>{movie.title}</h1>
                      <h4>{movie.original_title}</h4>
                    </MovieDetailTitle>
                    <MovieDetailInfo>
                      <MovieMetadata>
                        <MovieMetadataItem>
                          {movie.release_date} <Separator />
                        </MovieMetadataItem>
                        <MovieMetadataItem>
                          {movie.runtime}분 <Separator />
                        </MovieMetadataItem>
                        <MovieMetadataItem>
                          {movie.genres.map((genre) => genre.name).join(',')}{' '}
                        </MovieMetadataItem>
                      </MovieMetadata>
                      <MovieTagLine>
                        {movie.tagline ?? <TagLiner />}
                        {movie.tagline}
                      </MovieTagLine>
                      <MovieDetailOverview>
                        {movie.overview}
                      </MovieDetailOverview>
                    </MovieDetailInfo>
                  </MovieInfo>
                </MovieDetailBody>
              </>
            )}
          </MovieDetailModal>
        </>
      )}
    </>
  );
}

export default MovieDetail;
