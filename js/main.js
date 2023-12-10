const pokemonContainer = document.querySelector('.pokemon-container')
const spinner = document.querySelector('#spinner')
const previous = document.querySelector('#previous')
const next = document.querySelector('#next')

let offset = 1
let limit = 8

previous.addEventListener('click', () => {
    if (offset != 1) {
        offset -= 9
        removeChildNodes(pokemonContainer)
        fetchPokemons(offset, limit)
    }
})

next.addEventListener('click', () => {
    offset += 9
    removeChildNodes(pokemonContainer)
    fetchPokemons(offset, limit)
})


//* LLamada a la API
function fetchPokemon(id) {

    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then((res) => res.json())
        .then((data) => {
            createPokemon(data)
            spinner.style.display = 'none'
        })
}

//* Función para traer los 9 primeros pokemones
function fetchPokemons(offset, limit) {

    spinner.style.display = 'block'

    for (let i = offset; i <= offset + limit; i++) {
        fetchPokemon(i)
    }

}

//* Función para crear las cards de pokemones

function createPokemon(pokemon) {

    // Efecto flip
    const flipCard = document.createElement('div')
    flipCard.classList.add('flip-card')

    const cardContainer = document.createElement('div')
    cardContainer.classList.add('card-container')

    flipCard.appendChild(cardContainer)

    // Cards
    const card = document.createElement('div')
    card.classList.add('pokemon-block')

    const spriteContainer = document.createElement('div')
    spriteContainer.classList.add('img-container')

    const sprite = document.createElement('img')
    sprite.src = pokemon.sprites.front_default

    spriteContainer.appendChild(sprite)

    const number = document.createElement('p')
    number.textContent = `#${pokemon.id.toString().padStart(3, 0)}` // padStart le añade 2 ceros al principio

    const name = document.createElement('p')
    name.classList.add('name')
    name.textContent = pokemon.name

    card.appendChild(spriteContainer)
    card.appendChild(number)
    card.appendChild(name)

    const cardBack = document.createElement('div')
    cardBack.classList.add('pokemon-block-back')

    cardBack.appendChild(progressBars(pokemon.stats))

    cardContainer.appendChild(card)
    cardContainer.appendChild(cardBack)
    pokemonContainer.appendChild(flipCard)
}

//* Barra de progreso que se muestra en la parte de atrás de las cards
function progressBars(stats) {
    const statsContainer = document.createElement('div')
    statsContainer.classList.add('stats-container')

    // Traducir al castellano la info 
    const translationMap = {
        'hp': 'PS',
        'attack': 'Ataque',
        'defense': 'Defensa',
    };

    for (let i = 0; i < 3; i++) {

        const stat = stats[i]

        const statPercent = stat.base_state / 2 + '%'
        const statContainer = document.createElement('div')
        statContainer.classList.add('stat-container')

        const statName = document.createElement('div')
        statName.textContent = translationMap[stat.stat.name] || stat.stat.name; // Muestra la info en castellano

        const progress = document.createElement('div')
        progress.classList.add('progress')

        // Clases de bootstrap
        const progressBar = document.createElement('div')
        progressBar.classList.add('progress-bar')
        progressBar.setAttribute('aria-valuenow', stat.base_stat)
        progressBar.setAttribute('aria-valuemin', 0)
        progressBar.setAttribute('aria-valuemax', 200)
        progressBar.style.width = statPercent

        progressBar.textContent = stat.base_stat

        progress.appendChild(progressBar)
        statContainer.appendChild(statName)
        statContainer.appendChild(progress)
        statsContainer.appendChild(statContainer)
    }

    return statsContainer
}

function removeChildNodes(parent) {

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

fetchPokemons(offset, limit)