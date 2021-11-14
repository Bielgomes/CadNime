class Anime {
  constructor(titulo, ano, episodios, generos, categoria, score, image, sinopse) {
    this.titulo = titulo;
    this.ano = ano;
    this.episodios = episodios;
    this.generos = generos;
    this.categoria = categoria;
    this.score = score;
    this.image = image;
    this.sinopse = sinopse;
  }
}

var listaAnimes = []

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function limparCampos() {
  $('input').val('')
  $('textarea').val('')
  $('#btnSalvar').text("Cadastrar")
  $('#btnSalvar').removeAttr('data-edit')
}

function cadastrar(objeto, lista) {
  lista.push(objeto)

  localStorage.setItem('listaAnimes', JSON.stringify(lista))
}

function getStars(score) {
  let auxScore = ''
  let auxStars = 10

  score = parseFloat(score)

  for (let i = 0; i < Math.round(score); i++) {
    auxScore += '<ion-icon name="star"></ion-icon>'
    auxStars -= 1
  }
  if (Number(score) === score && score % 1 !== 0) {
    auxScore += '<ion-icon name="star-half"></ion-icon>'
    auxStars -= 1
  }
  for (let i = 0; i < auxStars; i++) {
    auxScore += '<ion-icon name="star-outline"></ion-icon>'
  }

  return auxScore
}

function listar(lista) {
  let auxHtml = ''

  lista.forEach((element, id) => {
    if (element.categoria != "anime") {
      aux = "Capitulos"
    } else {
      aux = "Episódios"
    }

    let auxGeneros = element.generos.split(",")
    let auxHtmlGeneros = ''

    for (let i = 0; i < auxGeneros.length; i++) {
      auxHtmlGeneros += `
      <p class="generos">${capitalize(auxGeneros[i])}</p>
      `
    }

    auxHtml += `
    <div class="container-animes">
      <div class="fields-animes head-animes">
        <h3>${capitalize(element.titulo)}</h3>
        <div>
          <img class="img-animes" onerror="imageError()" src=${element.image}>
        </div>
        <p class="genero-main">${capitalize(element.categoria)}</p>
      </div>
      <div class="fields-animes score">
        <p>${getStars(element.score)}<br>${element.score} / 10</p>
      </div>
      <div class="fields-animes">
        <p>Ano de lançamento<br>${element.ano}</p>
      </div>
      <div class="fields-animes">
        <p>Gêneros</p>
        <div class="field-generos">${auxHtmlGeneros}</div>
      </div>
      <div class="fields-animes">
        <p>${aux}<br>${element.episodios}</p>
      </div>
      <div class="fields-animes">
        <p>Sinopse<br>${element.sinopse}</p>
      </div>
      <div class="btns-animes">
        <button class="btn btn-outline-warning btn-animes edit" data-edit="${id}"><ion-icon name="pencil-outline"></ion-icon></button>
        <button class="btn btn-outline-danger btn-animes delete" data-delete="${id}"><ion-icon name="close-outline"></ion-icon></button>
      </div>
      </div>
    `
  })

  return auxHtml
}

$(document).ready(() => {
  listaAnimes = localStorage.getItem('listaAnimes') ? JSON.parse(localStorage.getItem('listaAnimes')) : listaAnimes

  $('#div-animes').html(listar(listaAnimes))

  addEvent()

  $('#btnSalvar').click((element) => {
    const index = Number(element.target.dataset.edit)
    
    let titulo = $('#titulo').val()
    let ano = $('#ano').val()
    if (ano < 1900 || ano > 2100) return alert('Ano inválido')
    let episodios = $('#episodios').val()
    let generos = $('#generos').val()
    let categorias = $('#categoria').val()
    let score = $('#score').val()
    let image = $('#image').val()
    let sinopse = $('#sinopse').val()

    if (image == "") image = "./assets/no-image.png"

    if (score <= 0 || score == "") {
      score = "?"
    } else if (score > 10) {
      return alert('Score inválido')
    }

    if (episodios <= 0 || episodios == "") episodios = "Indefinido"

    if (sinopse == "") sinopse = "Sem sinopse "

    if (titulo != "" && ano != "" && generos != "") {
      let anime = new Anime(titulo, ano, episodios, generos, categorias, score, image, sinopse)

      if (isNaN(index)) {
        cadastrar(anime, listaAnimes)
      } else {
        listaAnimes[index] = anime
      }

      $('#div-animes').html(listar(listaAnimes))

      addEvent()

      limparCampos()
    } else {
      alert('Preencha os campos obrigatórios')
    }
  })

  function addEvent() {
    $("button.edit").click((element) => {
      const index = Number(element.target.dataset.edit)
      let anime = listaAnimes[index]
      
      $('#titulo').val(anime.titulo)
      $('#ano').val(anime.ano)
      $('#episodios').val(anime.episodios)
      $('#generos').val(anime.generos)
      $('#categoria').val(anime.categoria)
      $('#score').val(anime.score)
      $('#image').val(anime.image)
      $('#sinopse').val(anime.sinopse)

      $('#btnSalvar').attr('data-edit', index)
      $('#btnSalvar').text("Editar")
    })

    $("button.delete").click((element) => {
      const index = Number(element.target.dataset.delete)

      const newListaAnimes = listaAnimes.filter((e,i) => i !== index)

      listaAnimes.length = 0;
      listaAnimes.push(...newListaAnimes)

      localStorage.setItem('listaAnimes', JSON.stringify(listaAnimes))

      $('#div-animes').html(listar(listaAnimes))

      addEvent()

      const edit = Number($('#btnSalvar').attr('data-edit'))

      if (edit == index) limparCampos()
    })
  }
  function imageError() {
    $('#image').attr('src', './assets/no-image.png')
  }
})

