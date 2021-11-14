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

// var listaAnimes = [{
//   "titulo": "Sword Art Online",
//   "ano": "2012",
//   "episodios": "25",
//   "generos": "Ação, Aventura, Fantasia, Romance",
//   "categoria": "anime",
//   "score": "7.2",
//   "image": "https://cdn.myanimelist.net/images/anime/11/39717.jpg",
//   "sinopse": 'Kazuto Kirigaya, apelidado de "Kirito", está entre os poucos entusiastas sortudos que colocaram as mãos na primeira remessa do jogo. Ele se conecta para se encontrar, com dez mil outras pessoas, no mundo cênico e elaborado de Aincrad, um mundo cheio de fantásticas armas medievais e monstros horríveis. No entanto, em uma virada cruel de eventos, os jogadores logo percebem que não podem sair; o criador do jogo os prendeu em seu novo mundo até que completem todos os cem níveis do jogo.'
// },
// {
//   "titulo": "Komi-san wa, Comyushou desu",
//   "ano": "2021",
//   "episodios": "Indefinido  ",
//   "generos": "Comédia, Slice of Life",
//   "categoria": "anime",
//   "score": "8.3",
//   "image": "https://cdn.myanimelist.net/images/anime/1899/117237.jpg",
//   "sinopse": "Hitohito Tadano é um garoto comum que entra em seu primeiro dia de escola com um plano claro: evitar problemas e fazer o melhor para se misturar com os outros. Infelizmente, ele falha imediatamente ao se sentar ao lado da madona da escola - Shouko Komi. Seus colegas agora o reconhecem como alguém a ser eliminado por uma chance de sentar ao lado da garota mais bonita da classe."
// },
// {
//   "titulo": "Saihate no Paladin",
//   "ano": "2021",
//   "episodios": "Indefinido",
//   "generos": "Aventura, Fantasia",
//   "categoria": "anime",
//   "score": "7.4",
//   "image": "https://cdn.myanimelist.net/images/anime/1176/118382.jpg",
//   "sinopse": "À medida que Will cresce e aprende sobre o mundo em que nasceu, ele se prepara para o dia em que deve finalmente partir sozinho. Para Will, essa jornada inclui uma promessa para toda a vida. Ao atingir a maioridade, todo adulto é obrigado a fazer um juramento ao deus de sua escolha, com a força da promessa afetando o grau da bênção de seu deus jurado."
// }]

var listaAnimes = []

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
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
      score = "10"
    }

    if (episodios <= 0 || episodios == "") episodios = "Indefinido"

    if (sinopse == "") sinopse = "Sem sinopse "

    if (titulo != "" && ano != "" && generos != "") {
      let anime = new Anime(titulo, ano, episodios, generos, categorias, score, image, sinopse)

      if (isNaN(index)) {
        cadastrar(anime, listaAnimes)
      } else {
        listaAnimes[index] = anime
        $('#btnSalvar').removeAttr('data-edit')
        $('#btnSalvar').text("Cadastrar")
      }

      $('#div-animes').html(listar(listaAnimes))

      addEvent()

      $('input').val('')
      $('textarea').val('')
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

      $('#div-animes').html(listar(listaAnimes))

      addEvent()
    })
  }
  function imageError() {
    $('#image').attr('src', './assets/no-image.png')
  }
})

