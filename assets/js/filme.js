const button = document.getElementById('button');
const filmes = document.getElementById('cards');
var busca;
var page = 1;
const apiKey = 'f580358ba3067e7d6db3699901341884';

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
            video.length != 0 ? button.setAttribute('onclick', `trailer('${video[0].key}')`) : button.setAttribute('onclick', 'trailer()');
            button.textContent = `Trailer`;
            li.append(h3, img, createP(`Sinopse: ${overview}`), createP(`Lançamento: ${release_date}`), createP(`Classificação: ${vote_average}`),
                createP(`Votos: ${vote_count}`), createP(`Duração: ${runtime}`),
                createP(`Generos: ${generos}`), createP(`Companhias: ${companhias}`), button);
            fragment.append(li);
        })
}

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