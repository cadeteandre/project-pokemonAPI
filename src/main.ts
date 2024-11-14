import './style.css'
import { IPokemon, IPokemonList, IResult, IType } from './interfaces/IPokemon';

const BASE_URL = "https://pokeapi.co/api/v2/";

//* ------------------------ Selecting HTML elements ------------------------
const displayCardsWrapper = document.querySelector('#display__cards__wrapper') as HTMLDivElement;
const typeButtons = document.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
const searchInput = document.querySelector('#search__input') as HTMLInputElement;

let pokemonArr: string[] = []; //| saving the first fetch
let pokemonDataArr: IPokemon[] = []; //| saving the second fetch

//* ------------------------ Declaring functions ------------------------

async function fetchAllPokemon(url: string): Promise<void> {
    try {
        const response = await fetch(url);
        const result = await response.json() as IPokemonList;
        const pokemonURLArr = result.results.map((pokemon: IResult) => pokemon.url);
        pokemonArr = [...pokemonURLArr];
        console.log("Fetched Pokemon URLs:", pokemonArr);
    } catch (err) {
        console.error(err);
    }
}

async function fetchSinglePokemon(url: string): Promise<void> {
    try {
        const response = await fetch(url);
        const pokemon = await response.json() as IPokemon;
        pokemonDataArr.push(pokemon);
    } catch (err) {
        console.error(err);
    }
}
async function displayCard(pokemon: IPokemon): Promise<void> {
    displayCardsWrapper.innerHTML += `
        <div class="poke_card">
            <img src="${pokemon.sprites.other.dream_world.front_default}" />
            <div>
                <p>#${pokemon.id.toString().padStart(3, '0')}</p>
                <p>${pokemon.name}</p>
                ${matchBtnToType(pokemon)}
            </div>
        </div>
    `;
}

function matchBtnToType(pokemon: IPokemon): string {
    const result = pokemon.types.map((types) => types.type.name);
        return result.map((type) => `<button class="${type}">${type}</button>`).join('');
}


async function init() {
    await fetchAllPokemon(`${BASE_URL}/pokemon/?limit=200`);
    await Promise.all(pokemonArr.map(async (url) => await fetchSinglePokemon(url)));
    console.log("Fetched Pokemon Data:", pokemonDataArr);
    pokemonDataArr.sort((a: IPokemon, b: IPokemon) => a.id - b.id);
    pokemonDataArr.forEach(async (pokemon) => await displayCard(pokemon));
}

//* ------------------------ Events ------------------------
typeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        displayCardsWrapper.innerHTML = '';
        const pokeType: IType = { type: { name: '' } };
        pokeType.type.name = button.className;
        const filteredPokemon = pokemonDataArr.filter(pokemon =>
            pokemon.types.find((elt) => elt.type.name === pokeType.type.name) !== undefined
        );

        filteredPokemon.forEach(async (pokemon) => await displayCard(pokemon));
    });
});

searchInput.addEventListener('input', () => {
    displayCardsWrapper.innerHTML = '';
    const pokemonName = searchInput.value.trim().toLowerCase();
    console.log(pokemonName);
    const filteredPokemon = pokemonDataArr.filter(pokemon =>
        pokemon.name.toLowerCase().includes(pokemonName)
    );
    filteredPokemon.forEach(pokemon => displayCard(pokemon));
});

init();

