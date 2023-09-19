const populateArray = () => {
    let rNum = 0;
    let medias = [];
    // Para cada posição do array, gera um número pseudo-aleatório
    for (i = 0; i < 8; i++) {
      // O range dos números é de 0 a 19, definidos pela varíavel abaixo
      rNum = Math.floor(Math.random() * 19);
      // Se um número não existe no array, então inclui
      if (!medias.includes(rNum)) {
        medias[i] = rNum;
      } else {
        // Senão, diminui o contador e gera um novo número para a posição do array
        i--
      }
    }
    return medias;
  }

const getMovies = async () => {
    const response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=818306944e112ccf75d496086ac6c42e&language=pt-BR&with_origin_country=US&without_genres=10767%2C%2010764&page=1');
    if (response.status === 200) {
        const data = await response.json();
        return data.results;
    }
    return false;
}

const getSeries = async () => {
    const response = await fetch('https://api.themoviedb.org/3/discover/tv?api_key=818306944e112ccf75d496086ac6c42e&language=pt-BR&with_origin_country=US&without_genres=10767%2C%2010764&page=1');
    if (response.status === 200) {
        const data = await response.json();
        return data.results;
    }
    return false;
}

const getMedia = async () => {
    let array = populateArray();
    let movies = await getMovies(); 
    let series = await getSeries(); 
    const poster_path = "https://www.themoviedb.org/t/p/original"
    document.getElementById("filme1").src = poster_path + movies[array[0]].poster_path;
    document.getElementById("filme2").src = poster_path + series[array[1]].poster_path;
    document.getElementById("filme3").src = poster_path + movies[array[2]].poster_path;
    document.getElementById("filme4").src = poster_path + series[array[3]].poster_path;
    document.getElementById("filme5").src = poster_path + series[array[4]].poster_path;
    document.getElementById("filme6").src = poster_path + movies[array[5]].poster_path;
    document.getElementById("filme7").src = poster_path + series[array[6]].poster_path;
    document.getElementById("filme8").src = poster_path + movies[array[7]].poster_path;
}

window.onload = () => {
    getMedia();
}