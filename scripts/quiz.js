const movieTitle = document.querySelector(".movie__title");
const movieBackdrop = document.querySelector(".movie__backdrop");
const movieOverview = document.querySelector(".movie__overview");
const movieGenres = document.querySelector(".movie__genres");
const movieId = document.querySelector(".movie__id");
const movieRelease = document.querySelector(".movie__release");
const movieRevenue = document.querySelector(".movie__revenue");
const movieBudget = document.querySelector(".movie__budget");
const movieTagline = document.querySelector(".movie__tagline");
const movieRuntime = document.querySelector(".movie__runtime");
const movieSpoken = document.querySelector(".movie__spoken");
const alternativesParent = document.querySelector(".alternatives");
const loading = document.getElementById("loading");

const language = {
    "English": "Inglês",
    "Mandarin": "Madarin",
    "Japanese": "Japonês",
    "Italian": "Italiano",
    "Portuguese": "Português",
    "Deutsch": "Alemão",
    "Hindi": "Hindi",
    "Korean": "Coreano",
    "French": "Francês",
    "Spanish": "Espanhol",
    "Russian": "Russo",
    "Czech": "Tcheco",
    "Dutch": "Holandês",
    "Swedish": "Sueco",
    "Arabic": "Árabe",
}

let movieName = "";

const getMovies = async () => {
    rNum = Math.floor(Math.random() * 500) + 1;

    const response = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=818306944e112ccf75d496086ac6c42e&language=pt-BR&page=' + rNum);

    if (response.status === 200) {
        const data = await response.json();
        rPos = Math.floor(Math.random() * data.results.length);
        while (data.results[rPos].backdrop_path === null) {
            rPos += rPos;
        }
        // console.log(data.results[rPos]);
        return data.results[rPos];
    }
    return false;
}

const getMovieById = async (id) => {
    const response = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=818306944e112ccf75d496086ac6c42e&language=pt-BR');

    if (response.status === 200) {
        const data = await response.json();

        // console.log(data);
        return data;
    }
    return false;
}

const getSimilarMovies = async (id) => {

    const response = await fetch('https://api.themoviedb.org/3/movie/' + id + '/similar?api_key=818306944e112ccf75d496086ac6c42e&language=pt-BR');

    if (response.status === 200) {
        const res = await response.json();
        let data = res.results;
        const similarMovies = data.sort(
            (p1, p2) => (p1.popularity < p2.popularity) ? 1 : (p1.popularity > p2.popularity) ? -1 : 0);
        return similarMovies;
    }

    return false;
}

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}


const createAlternative = (item) => {
    const alternative = createElement('button', 'alternative btn btn-outline-light w-100 text-start my-1');
    alternative.innerHTML = item;
    alternative.setAttribute('movie-data', item);
    alternative.addEventListener('click', checkAnswer);
    return alternative;
}

const checkAnswer = ({target}) => {

    document.querySelectorAll(".alternative").forEach(element => {
        if (element.getAttribute('movie-data') === movieName) {
            element.classList.remove('btn-outline-light');
            element.classList.add('btn-success');
            element.style.pointerEvents = "none";
        } else {
            element.classList.remove('btn-outline-light');
            element.classList.add('btn-danger');
            element.style.pointerEvents = "none";
        }
    });

    const answer = document.getElementById("answerScore");
    document.getElementById("selectedAlternative").innerHTML = "Você selecionou: (" + target.getAttribute('movie-data') + ")";

    if(target.getAttribute('movie-data') === movieName){
        answer.innerHTML = "Você acertou!";
        answer.classList.add("text-success");
    } else {
        answer.innerHTML = "Você errou!"
        answer.classList.add("text-danger");
    }

    alternativesParent.classList.add('col-md-6');
    document.querySelector(".movie_data").style.display = "block";
    const retry = document.getElementById("playAgain");
    retry.addEventListener("click", resetGame)
}

const movieData = async () => {
    try {
        const res = await getMovies();
        movieName = res.title;
        const movie = await getMovieById(res.id);
        const similar = await getSimilarMovies(res.id);
        const alternatives = [movieName, similar[0].title, similar[1].title, similar[2].title, similar[3].title];
        const shuffledArray = shuffle(alternatives);
        loading.style.display = "none";
        movieBackdrop.innerHTML = '<img class="movie__backdropImage" src="https://www.themoviedb.org/t/p/original' + movie.backdrop_path + '" alt="selected_movie"/>';
        shuffledArray.forEach(item => {
            const alternative = createAlternative(item);
            alternativesParent.appendChild(alternative);
        });
        movieTitle.innerHTML = '<p><span class="fw-bold">Título: </span>' + movie.title + '</p>';

        if (movie.overview !== "") {
            movieOverview.innerHTML = '<p><span class="fw-bold">Sinopse: </span>' + movie.overview + '</p>';
        }
        if (movie.tagline !== "") {
            movieTagline.innerHTML = '<p><span class="fw-bold">Tagline: </span>' + movie.tagline + '</p>';
        }
        let movieDate = movie.release_date.split("-");
        movieRelease.innerHTML = '<p><span class="fw-bold">Data de Lançamento: </span>' + movieDate[2] + '/' + movieDate[1] + '/' + movieDate[0] + '</p>';
        if (movie.budget !== 0) {
            movieBudget.innerHTML = '<p><span class="fw-bold">Orçamento: </span>' + movie.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD' }); + '</p>';
        }
        if (movie.revenue !== 0) {
            movieRevenue.innerHTML = '<p><span class="fw-bold">Bilheteria: </span>' + movie.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }); + '</p>';
        }
        movieRuntime.innerHTML = '<p><span class="fw-bold">Duração: </span>' + movie.runtime + ' minutos</p>';
        if(language[movie.spoken_languages[0].english_name] === undefined){
            movieSpoken.innerHTML = '<p><span class="fw-bold">Língua Original: </span>' + movie.spoken_languages[0].english_name + '</p>';
        } else {
            movieSpoken.innerHTML = '<p><span class="fw-bold">Língua Original: </span>' + language[movie.spoken_languages[0].english_name] + '</p>';
        }
        
    } catch (err) {
        location.reload();
    }
}

const resetGame = () => {
    location.reload();
}

window.onload = () => {

    movieData();
}










