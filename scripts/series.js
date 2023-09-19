let array_series = [];
let page = 1;

const genres = {
    "10759": { "name": "Ação e Aventura" },
    "16": { "name": "Animação" },
    "35": { "name": "Comédia" },
    "80": { "name": "Crime" },
    "99": { "name": "Documentário" },
    "18": { "name": "Drama" },
    "10751": { "name": "Família" },
    "10762": { "name": "Kids" },
    "9648": { "name": "Mistério" },
    "10763": { "name": "Notícia" },
    "10764": { "name": "Reality" },
    "10765": { "name": "Ficção Científica e Fantasia" },
    "10766": { "name": "Soap" },
    "10767": { "name": "Talk Show" },
    "10768": { "name": "Guerra e Política" },
    "37": { "name": "Velho Oeste" }
}

const getSeries = async () => {

    const response = await fetch('https://api.themoviedb.org/3/discover/tv?api_key=818306944e112ccf75d496086ac6c42e&language=pt-BR&with_origin_country=US&without_genres=10767%2C%2010764&page=' + page);

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

// Função para criar tiles de séries
const createTile = (series, position) => {

    const tile = createElement('div', 'tile');
    tile.setAttribute('position', position);
    tile.classList.add('col-6', 'col-sm-4', 'col-md-3', 'col-lg-2', 'mt-5');
    const anchor = createElement('a', 'tile__image');
    anchor.setAttribute('href', "");
    anchor.setAttribute('data-bs-toggle', "modal");
    anchor.setAttribute('data-bs-target', "#seriesModal");
    const image = createElement('img', 'd-block');
    image.setAttribute('alt', "series_poster");
    image.classList.add('w-100', 'rounded-4');
    const title = createElement('h5', '')
    const poster_path = "https://www.themoviedb.org/t/p/original"

    // Atribui a hierarquia dos elementos
    tile.appendChild(anchor);
    anchor.appendChild(image);
    tile.appendChild(title);

    // Define o caminho da imagem no tile
    image.src = poster_path + series.poster_path;

    // Atribui o nome da série
    title.innerHTML = series.name;

    tile.addEventListener("click", editModal);

    // Retorna a tile criada
    return tile;
}

const editModal = ({target}) => {
    const pos = target.parentNode.parentNode.getAttribute('position');
    const imagePath = "https://www.themoviedb.org/t/p/original";
    // document.getElementById('series_backdrop').src = imagePath + array_series[pos].backdrop_path;
    document.getElementById('series_poster').src = imagePath + array_series[pos].poster_path;
    document.getElementById('seriesModalLabel').innerHTML = "Título: " + array_series[pos].name;
    const redirectToTmdb = () => {
        let linkName = array_series[pos].original_name.replace(/[:$&/]/g," ");
        linkName = linkName.replace(new RegExp("   ", "g"), " ").replace(new RegExp("  ", "g"), " ").replace(new RegExp(" ", "g"), "-").replace(new RegExp("'", "g"), "-").toLowerCase();
        return linkName;
    } 
    document.getElementById('series_tmdb').innerHTML = "<a href='https://www.themoviedb.org/tv/" + array_series[pos].id + "-" + redirectToTmdb() + "?language=pt-BR' target='_blank' class='btn btn-primary'>Abrir no TMDB</a>" ;
    document.getElementById('series_name').innerHTML = "Nome Original: <b>" + array_series[pos].original_name + "</b>";
    const generos = array_series[pos].genre_ids;
    const getGenre = () => {
        const gen = [];
        for (let i = 0; i < generos.length; i++) {
            gen.push(" " + genres[generos[i]].name);
        }
        return gen;
    }
    document.getElementById('series_genre').innerHTML = "Gênero(s): <b>" + getGenre() + "</b>";
    const date = () => {
        let launchDate = array_series[pos].first_air_date.split("-");
        launchDate = launchDate[2] + "/" + launchDate[1] + "/" + launchDate[0];
        return launchDate;
    }
    document.getElementById('series_date').innerHTML = "Lançamento: <b>" + date() + "</b>";
    document.getElementById('series_sinopse').innerHTML = "Sinopse: <b>" + array_series[pos].overview + "</b>";
    document.getElementById('series_nota').innerHTML = "Nota Média: <b>" + array_series[pos].vote_average + "</b>";
    document.getElementById('series_count').innerHTML = "Votos: <b>" + array_series[pos].vote_count + "</b>";
    document.getElementById('series_popularity').innerHTML = "Popularidade: <b>" + array_series[pos].popularity + "</b>";
}

const handleLoad = ({target}) => {
    loadSeries()
    target.style.display = "none";
}

// Função para auxiliar a criação de elementos html
const loadSeries = async () => {
    const series_wrapper = document.getElementById("series_wrapper");
    const series = await getSeries();
    page = page + 1;
    array_series = series;

    series.forEach((element, i) => {
        const tile = createTile(element, i);
        series_wrapper.appendChild(tile);
    });

    const button = createElement("button", "btn");
    button.classList.add("btn-primary", "mt-5");
    button.innerHTML = "Carregar Mais...";
    button.addEventListener("click", handleLoad);
    series_wrapper.appendChild(button);
}

window.onload = () => {
    loadSeries();
}