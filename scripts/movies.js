let array_movies = [];
let page = 1;

const genres = {
    "28": { "name": "Ação" },
    "12": { "name": "Aventura" },
    "16": { "name": "Animação" },
    "35": { "name": "Comédia" },
    "80": { "name": "Crime" },
    "27": { "name": "Terror" },
    "99": { "name": "Documentário" },
    "18": { "name": "Drama" },
    "10751": { "name": "Família" },
    "14": { "name": "Fantasia" },
    "36": { "name": "História" },
    "10402": { "name": "Música" },
    "9648": { "name": "Mistério" },
    "10749": { "name": "Romance" },
    "878": { "name": "Ficção Científica" },
    "10770": { "name": "TV Movie" },
    "53": { "name": "Suspense" },
    "10752": { "name": "Guerra" },
    "37": { "name": "Velho Oeste" }
}

const getMovies = async () => {

    const response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=818306944e112ccf75d496086ac6c42e&language=pt-BR&with_origin_country=US&without_genres=10767%2C%2010764&page=' + page);

    if (response.status === 200) {
        const data = await response.json();
        return data.results;
    }
    return false;
}

const getTrailer = async (id) => {

    const response = await fetch('https://api.themoviedb.org/3/movie/' + id + '/videos?api_key=818306944e112ccf75d496086ac6c42e&language=pt-BR');
    if (response.status === 200) {
        const data = await response.json();
        return data.results;
    }
    return false;
}

// Função para auxiliar a criação de elementos html
const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Função para criar tiles de filmes
const createTile = (movie, position) => {

    const tile = createElement('div', 'tile');
    tile.setAttribute('position', position);
    tile.classList.add('col-6', 'col-sm-4', 'col-md-3', 'col-lg-2', 'mt-5');
    const anchor = createElement('a', 'tile__image');
    anchor.setAttribute('href', "");
    anchor.setAttribute('data-bs-toggle', "modal");
    anchor.setAttribute('data-bs-target', "#moviesModal");
    const image = createElement('img', 'd-block');
    image.setAttribute('alt', "movies_poster");
    image.classList.add('w-100', 'rounded-4');
    const title = createElement('h5', '')
    const poster_path = "https://www.themoviedb.org/t/p/original"

    // Atribui a hierarquia dos elementos
    tile.appendChild(anchor);
    anchor.appendChild(image);
    tile.appendChild(title);

    // Define o caminho da imagem no tile
    image.src = poster_path + movie.poster_path;

    // Atribui o nome do Filme
    title.innerHTML = movie.title;

    tile.addEventListener("click", editModal);

    // Retorna a tile criada
    return tile;
}

const editModal = async ({target}) => {
    const pos = target.parentNode.parentNode.getAttribute('position');
    const imagePath = "https://www.themoviedb.org/t/p/original";
    // document.getElementById('movies_backdrop').src = imagePath + array_movies[pos].backdrop_path;
    document.getElementById('movies_poster').src = imagePath + array_movies[pos].poster_path;
    document.getElementById('moviesModalLabel').innerHTML = "Título: " + array_movies[pos].title;
    const redirectToTmdb = () => {
        let linkName = array_movies[pos].original_title.replace(/[:$&/]/g," ");
        linkName = linkName.replace(new RegExp("   ", "g"), " ").replace(new RegExp("  ", "g"), " ").replace(new RegExp(" ", "g"), "-").replace(new RegExp("'", "g"), "-").toLowerCase();
        return linkName;
    } 
    document.getElementById('movies_tmdb').innerHTML = "<a href='https://www.themoviedb.org/movie/" + array_movies[pos].id + "-" + redirectToTmdb() + "?language=pt-BR' target='_blank' class='btn btn-primary'>Abrir no TMDB</a>" ;
    document.getElementById('movies_name').innerHTML = "Nome Original: <b>" + array_movies[pos].original_title + "</b>";
    const generos = array_movies[pos].genre_ids;
    const getGenre = () => {
        const gen = [];
        for (let i = 0; i < generos.length; i++) {
            gen.push(" " + genres[generos[i]].name);
        }
        return gen;
    }
    document.getElementById('movies_genre').innerHTML = "Gênero(s): <b>" + getGenre() + "</b>";
    const date = () => {
        let launchDate = array_movies[pos].release_date.split("-");
        launchDate = launchDate[2] + "/" + launchDate[1] + "/" + launchDate[0];
        return launchDate;
    }
    document.getElementById('movies_date').innerHTML = "Lançamento: <b>" + date() + "</b>";
    document.getElementById('movies_sinopse').innerHTML = "Sinopse: <b>" + array_movies[pos].overview + "</b>";
    document.getElementById('movies_nota').innerHTML = "Nota Média: <b>" + array_movies[pos].vote_average + "</b>";
    document.getElementById('movies_count').innerHTML = "Votos: <b>" + array_movies[pos].vote_count + "</b>";
    document.getElementById('movies_popularity').innerHTML = "Popularidade: <b>" + array_movies[pos].popularity + "</b>";
    const trailerUrl = await getTrailer(array_movies[pos].id);
    document.getElementById('trailer1').setAttribute("href", "https://www.youtube.com/watch?v=" + trailerUrl[0].key);
    document.getElementById('trailer2').setAttribute("href", "https://www.youtube.com/watch?v=" + trailerUrl[1].key);
}

const handleLoad = ({target}) => {
    loadMovies()
    target.style.display = "none";
}

// Função para auxiliar a criação de elementos html
const loadMovies = async () => {
    const movies_wrapper = document.getElementById("movies_wrapper");
    const movies = await getMovies();
    page = page + 1;
    array_movies = movies;

    movies.forEach((element, i) => {
        const tile = createTile(element, i);
        movies_wrapper.appendChild(tile);
    });

    const button = createElement("button", "btn");
    button.classList.add("btn-primary", "mt-5");
    button.innerHTML = "Carregar Mais...";
    button.addEventListener("click", handleLoad);
    movies_wrapper.appendChild(button);
}

window.onload = () => {
    loadMovies();
}