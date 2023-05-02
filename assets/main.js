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
const fragment = document.createDocumentFragment();
var page = 1;
var busca;

async function callApi(url){
    let resultado;
    await fetch(url).then((response) => response.json())
        .then(async (result) => {
            const promise = result.results.map(item => intoFilmes(item, fragment));
            await Promise.all(promise).then(() => {
                filmes.append(fragment);
                resultado = result;
            })
        })
    return resultado;
}

button.addEventListener('click', async function() {
    busca = document.getElementById('filme').value.replace(/\s+/g, '+');
    if (!/^\++$/.test(busca) && busca != ""){
        document.querySelector('section span').innerHTML = ""
        page = 1;
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${busca}&language=pt-BR&page=${page}`;
        filmes.innerHTML = ""
        showMore.style.display = 'none'
        const result = await callApi(url);
        if (result.total_results <= 0) document.querySelector('section span').innerHTML = "Não encontramos nenhum filme com esse nome";
        if (result.total_pages > 1){
            showMore.style.display = 'block';
            page++;
        }
    }else{
        filmes.innerHTML = ""
        showMore.style.display = 'none'
        document.querySelector('section span').innerHTML = "Você não digitou o nome do filme"
    }
});

showMore.addEventListener('click', async function () {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${busca}&language=pt-BR&page=${page}`
    const result = await callApi(url)
    if (page >= result.total_pages ) showMore.style.display = 'none';
    page++
})

function createP(text){
    const p = document.createElement('p');
    p.textContent = text;
    return p;
}

function intoFilmes(response, fragment){
    const url = `https://api.themoviedb.org/3/movie/${response.id}?api_key=${apiKey}&language=pt-BR&append_to_response=videos`
    return fetch(url).then((response) => response.json())
        .then((response) => {
            const imagem = response.poster_path == null ? "./assets/imagemIndisponivel.png" : `https://image.tmdb.org/t/p/w400${response.poster_path}`;
            const generos = response.genres.map(value => value.name).join(', ');
            const companhias = response.production_companies.map(value => value.name).join(', ');
            const { title, overview, release_date, vote_average, vote_count, runtime, videos: { results: video } } = response;
        
            const li = document.createElement('li');
            const h3 = document.createElement('h3');
            const img = document.createElement('img');
            const p = document.createElement('p');
            const button = document.createElement('button');
            li.classList.add('card');
            h3.textContent = `${title}`;
            img.setAttribute('src', `${imagem}`);
            img.setAttribute('alt', `post do filme ${title}`);
            video.length != 0 ? button.setAttribute('onclick', `trailerFilme('${video[0].key}')`) : button.setAttribute('onclick', 'trailerFilme()');
            button.textContent = `Trailer`;
            li.append(h3, img, createP(`Sinopse: ${overview}`), createP(`Lançamento: ${release_date}`), createP(`Classificação: ${vote_average}`),
                createP(`Votos: ${vote_count}`), createP(`Duração: ${runtime}`), createP(`Generos: ${generos}`), createP(`Companhias: ${companhias}`), button);
            fragment.append(li);
        })
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