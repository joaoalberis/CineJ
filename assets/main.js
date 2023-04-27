const button = document.querySelector('#busca-conteudo button');
const filmes = document.getElementById('cards');
const buttonTrailer = document.getElementById('trailer');
const modal = document.getElementById('modal');
const iframe = document.getElementById('video');
const modal_content = document.getElementById('modal-content');
const p = document.querySelector('#modal-content p');
const fecharModel = document.querySelector('#modal-content span');
const showMore = document.getElementById('showMore');
const apiKey = '';
var page = 1;
var url;
var busca;

button.addEventListener('click', function() {
    busca = document.getElementById('filme').value.replace(/\s+/g, '+');
    if (!/^\++$/.test(busca) && busca != ""){
        document.querySelector('section span').innerHTML = ""
        page = 1;
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${busca}&language=pt-BR&page=${page}`
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4){
                filmes.innerHTML = ""
                showMore.style.display = 'none'
                const result = JSON.parse(xhr.responseText);
                result.results.forEach(getId);
                if (result.total_results <= 0) document.querySelector('section span').innerHTML = "Não encontramos nenhum filme com esse nome";
                if (result.total_pages > 1){
                    showMore.style.display = 'block';
                    page++;
                }
            }
        }
    }else{
        filmes.innerHTML = ""
        showMore.style.display = 'none'
        document.querySelector('section span').innerHTML = "Você não digitou o nome do filme"
    }
});

showMore.addEventListener('click', function () {
    url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${busca}&language=pt-BR&page=${page}`
    fetch(url).then((response) => response.json())
        .then((result) => {
            result.results.forEach(getId);
            if (page >= result.total_pages ) showMore.style.display = 'none';
            page++
        })
        .catch((error) => console.log(error));
})

function getId(response){
    const url = `https://api.themoviedb.org/3/movie/${response.id}?api_key=${apiKey}&language=pt-BR&append_to_response=videos`
    fetch(url).then((response) => response.json())
        .then((result) => setHtmlInfoFilmes(result));
}

function setHtmlInfoFilmes(response){
    const titulo = response.title;
    const sinopse = response.overview;
    const imagem = response.poster_path == null ? "./assets/imagemIndisponivel.png" : `https://image.tmdb.org/t/p/w400${response.poster_path}` ;
    const lancamento = response.release_date;
    const classificacao = response.vote_average.toFixed(1);
    const votos = response.vote_count; 
    const duracao = response.runtime;
    const generos = response.genres.map(value => value.name).join(', ');
    const companhias = response.production_companies.map(value => value.name).join(', ');
    const video = response.videos.results;

    if (video.length != 0){
        filmes.innerHTML += `<li class="card">
            <h3>${titulo}</h3>
            <img src="${imagem}" alt="post do filme ${titulo}">
            <p>Sinopse: ${sinopse}</p>
            <p>Lançamento: ${lancamento}</p>
            <p>Classificação: ${classificacao}</p>
            <p>Votos: ${votos}</p>
            <p>Duração: ${duracao}</p>
            <p>Generos: ${generos}</p>
            <p>Companhias: ${companhias}</p>
            <button onclick="trailerFilme('${video[0].key}')" type="button">Trailer</button>
        </li>`
    }else {
        filmes.innerHTML += `<li class="card">
            <h3>${titulo}</h3>
            <img src="${imagem}" alt="post do filme ${titulo}">
            <p>Sinopse: ${sinopse}</p>
            <p>Lançamento: ${lancamento}</p>
            <p>Classificação: ${classificacao}</p>
            <p>Votos: ${votos}</p>
            <p>Duração: ${duracao}</p>
            <p>Generos: ${generos}</p>
            <p>Companhias: ${companhias}</p>
            <button onclick="trailerFilme()" type="button">Trailer</button>
        </li>`
    }
    
}

function trailerFilme(key = null){
    if (key != null){
        iframe.src = `https://www.youtube.com/embed/${key}`
        modal.style.display = 'flex';
    }else{
        p.textContent  = 'OBS: Esse filme não possui um trailer no banco de dados!'
        modal.style.display = 'flex'
    }
    
}

modal.addEventListener('click', () => {
    iframe.src = '';
    modal.style.display = 'none';
    p.textContent = '';
})

fecharModel.addEventListener('click', () => {
    iframe.src = '';
    modal.style.display = 'none';
    p.textContent = '';
    
})
