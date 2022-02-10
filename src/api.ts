const API_KEY = '520945fdf6771d8cc071cc16fd185649';
const BASE_PATH = 'https://api.themoviedb.org/3';

interface IMovie {
    backdrop_path: string;
    id: number;
    overview: string;
    poster_path: string;
    title: string;
}

export interface IGetMovieResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(response => response.json());
}
