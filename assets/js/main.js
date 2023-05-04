
const buttonTrailer = document.getElementById('trailer');
const modal = document.getElementById('modal');
const iframe = document.getElementById('video');
const modal_content = document.getElementById('modal-content');
const p = document.querySelector('#modal-content p');
const fecharModel = document.querySelector('#modal-content span');
const showMore = document.getElementById('showMore');
const fragment = document.createDocumentFragment();

function trailer(key = null){
    if (key != null){
        iframe.src = `https://www.youtube.com/embed/${key}`
        modal.style.display = 'flex';
    }else{
        p.textContent  = 'OBS: não possui um trailer no banco de dados!'
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