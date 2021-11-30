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

class Storage {
  constructor() {
    this.key = "listaAnimes";
  }

  getItem() {
    return localStorage.getItem(this.key) ? JSON.parse(localStorage.getItem(this.key)) : listaAnimes
  }

  setItem(lista) {
    localStorage.setItem(this.key, JSON.stringify(lista))
  }
}

const storage = new Storage()

var listaAnimes = []

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function limparCampos() {
  $('input').val('')
  $('textarea').val('')
  $('#btnSalvar').text("Cadastrar")
  $('#btnSalvar').removeAttr('rel')
  $('#btnCancelar').hide()
}

function cadastrar(objeto, lista) {
  lista.push(objeto)
  storage.setItem(lista)
}

function getStars(score) {
  let auxScore = ''
  let auxStars = 10

  score = parseFloat(score)

  for (let i = 0; i < Math.trunc(score); i++) {
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
    if (element.categoria == "anime") {
      aux = "Episódios"
    } else {
      aux = "Capitulos"
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
        <button class="btn btn-outline-warning btn-animes edit" rel="${id}"><ion-icon name="pencil-outline"></ion-icon></button>
        <button class="btn btn-outline-danger btn-animes delete" rel="${id}"><ion-icon name="close-outline"></ion-icon></button>
      </div>
      </div>
    `
  })

  return auxHtml
}

$(document).ready(() => {
  listaAnimes = storage.getItem()

  $('#div-animes').html(listar(listaAnimes))

  $('#btnSalvar').click( function() {    
    const id = Number($(this).attr('rel'))

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

    if (score == "") {
      score = "?"
    } else if (score > 10 || score <= 0 || isNaN(score)) {
      return alert('Score inválido')
    }

    if (episodios <= 0 || episodios == "") episodios = "Indefinido"

    if (sinopse == "") sinopse = "Sem sinopse "

    if (titulo != "" && ano != "" && generos != "") {
      let anime = new Anime(titulo, ano, episodios, generos, categorias, score, image, sinopse)

      if (isNaN(id)) {
        cadastrar(anime, listaAnimes)
      } else {
        listaAnimes[id] = anime
      }

      $('#div-animes').html(listar(listaAnimes))

      limparCampos()
    } else {
      alert('Preencha todos os campos obrigatórios')
    }
  })

  $('#div-animes').on('click', '.edit', function() {
    let id = $(this).attr('rel')

    $('#titulo').val(listaAnimes[id].titulo)
    $('#ano').val(listaAnimes[id].ano)
    $('#episodios').val(listaAnimes[id].episodios)
    $('#generos').val(listaAnimes[id].generos)
    $('#categoria').val(listaAnimes[id].categoria)
    $('#score').val(listaAnimes[id].score)
    $('#image').val(listaAnimes[id].image)
    $('#sinopse').val(listaAnimes[id].sinopse)

    $('#btnSalvar').text("Editar")
    $('#btnSalvar').attr('rel', id)
    $('#btnCancelar').show()
  })

  $('#div-animes').on('click', '.delete', function() {
    if(confirm('Deseja realmente excluir?')) {
      let id = $(this).attr('rel')
      listaAnimes.splice(id, 1)
      storage.setItem(listaAnimes)
      $('#div-animes').html(listar(listaAnimes))
      if ($('#btnSalvar').attr('rel') == id) {
        limparCampos()
      }
    }
  })

  $('#btnCancelar').click(() => {
    limparCampos()
  })
})