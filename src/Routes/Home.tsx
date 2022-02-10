import { motion, AnimatePresence, useViewportScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useMatch } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getMovies, IGetMovieResult } from '../api';
import { makeImagePath } from '../utils';

const Wrapper = styled.div`
    background: black;
`;
const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
    height: 100vh;
    background-color: red;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)), url(${props => props.bgPhoto});
    background-size: cover;
`;
const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`;
const Overview = styled.p`
    font-size: 30px;
    width: 50%;
`;
const Slider = styled.div`
    position: relative;
    top: -100px;
`;
const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    margin-bottom: 5px;
    position: absolute;
    width: 100%;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
    background-color: none;
    height: 200px;
    font-size: 30px;
    background-image: url(${props => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`;
const Info = styled(motion.div)`
    padding: 20px;
    background-color: ${props => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    bottom: 0;
    width: 100%;
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
const BigMovie = styled(motion.div)`
    position: absolute;
    width: 60vw;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${props => props.theme.black.lighter};
    border-radius: 15px;
    overflow: hidden;
`;

const BigCover = styled.div<{ bgPhoto: string }>`
    width: 100%;
    height: 500px;
    background-size: cover;
    background-position: center center;
    background-image: linear-gradient(to top, black, transparent), url(${props => props.bgPhoto});
`;
const BigTitle = styled.h3`
    color: ${props => props.theme.white.lighter};
    font-size: 36px;
    position: relative;
    top: -60px;
    padding: 20px;
`;
const BigOverview = styled.p`
    position: relative;
    padding: 20px;
    color: ${props => props.theme.white.lighter};
    top: -80px;
`;

const rowVariants = {
    hidden: {
        x: window.innerWidth + 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.innerWidth - 5,
    },
};
const BoxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -10,
        transition: {
            delay: 0.5,

            transition: { type: 'tween', duration: 0.3 },
        },
    },
};
const InfoVarinats = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,

            transition: { type: 'tween', duration: 0.3 },
        },
    },
};
const offset = 6;

function Home() {
    const navigator = useNavigate();
    const bigMovieMatch = useMatch('/movies/:movieId');
    const { scrollY } = useViewportScroll();
    const { data, isLoading } = useQuery<IGetMovieResult>(['movies', 'nowPlaying'], getMovies);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex(prev => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => setLeaving(prev => !prev);
    const onBoxClicked = (movieId: number) => {
        navigator(`/movies/${movieId}`);
    };
    const onOverlayClick = () => navigator('/');
    const clickedMovie =
        bigMovieMatch?.params.movieId && data?.results.find(movie => String(movie.id) === bigMovieMatch.params.movieId);

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading</Loader>
            ) : (
                <>
                    <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || '')}>
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: 'tween', duration: 1 }}
                                key={index}
                            >
                                {data?.results
                                    .slice(1)
                                    .slice(offset * index, offset * index + offset)
                                    .map(movie => (
                                        <Box
                                            layoutId={String(movie.id)}
                                            onClick={() => onBoxClicked(movie.id)}
                                            variants={BoxVariants}
                                            initial="normal"
                                            whileHover="hover"
                                            transition={{ type: 'tween' }}
                                            bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
                                            key={movie.id}
                                        >
                                            <Info variants={InfoVarinats}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <>
                                <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                                <BigMovie layoutId={bigMovieMatch.params.movieId} style={{ top: scrollY.get() + 100 }}>
                                    {clickedMovie && (
                                        <>
                                            <BigCover bgPhoto={makeImagePath(clickedMovie.backdrop_path)} />
                                            <BigTitle>{clickedMovie.title}</BigTitle>
                                            <BigOverview>{clickedMovie.overview}</BigOverview>
                                        </>
                                    )}
                                </BigMovie>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;
