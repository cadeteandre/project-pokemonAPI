import './style.css'
import { IPokemon, IPokemonList, IResult, IType } from './interfaces/IPokemon';

const BASE_URL = "https://pokeapi.co/api/v2/";

//* ------------------------ Selecting HTML elements ------------------------
const displayCardsWrapper = document.querySelector('#display__cards__wrapper') as HTMLDivElement;
const typeButtons = document.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
const searchInput = document.querySelector('#search__input') as HTMLInputElement;

//* ------------------------ Declaring functions ------------------------
async function fetchAllPokemon(url: string, pokeType?: IType) {
    try {
        const response = await fetch(url);
        const result = await response.json() as IPokemonList;
        const pokemonArr = result.results.map((pokemon: IResult) => {
            return pokemon.url
        })
        pokemonArr.forEach((url) => fetchSinglePokemon(url, pokeType));
    } catch(err) {
        console.error(err);
    }
}

async function fetchSinglePokemon(url: string, pokeType?: IType) {
    try {
        const response = await fetch(url);
        const pokemon = await response.json() as IPokemon;

        if(pokeType) {
            pokemon.types.forEach((typeArr) => {
                if(typeArr.type.name === pokeType.type.name) {
                    displayCard(pokemon);
                }
            })
        } else {
            displayCard(pokemon);
        }

    } catch(err) {
        console.error(err);
    }
}

function displayCard(pokemon: IPokemon): void {
    displayCardsWrapper.innerHTML += `
    <div class="poke_card">
        <img src="${pokemon.sprites.other.dream_world.front_default}" />
        <div>
            <p>#${pokemon.id.toString().padStart(3, '0')}</p>
            <p>${pokemon.name}</p>
            <p>${pokemon.types.map((types) => `${types.type.name} `).join('')}</p>
        </div>
    </div>
`;
}

//* ------------------------ Events ------------------------
typeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        displayCardsWrapper.innerHTML = '';
        const pokeType: IType = {type: {name: ''}};
        pokeType.type.name = button.id;
        fetchAllPokemon(`${BASE_URL}/pokemon`, pokeType);
    })
})

searchInput.addEventListener('input', () => {
    displayCardsWrapper.innerHTML = '';
    const pokemonName = searchInput.value;
})

//* ------------------------ Calling functions ------------------------
fetchAllPokemon(`${BASE_URL}/pokemon`);

// <p>${result.types.map((types) => `${types.type.name} `).join('')}</p>