// check if device is mobile or desktop
import pokemon from "pokemontcgsdk";
import {TcgFilters} from "../../const/TcgFilters.js";

export const isMobile = () => {
    return window.innerWidth < 768;
}

export function longpress(node, threshold = 500) {
    const handle_mousedown = () => {
        let start = Date.now();

        const timeout = setTimeout(() => {
            node.dispatchEvent(new CustomEvent('longpress'));
        }, threshold);

        const cancel = () => {
            clearTimeout(timeout);
            node.removeEventListener('mousemove', cancel);
            node.removeEventListener('mouseup', cancel);
        };

        node.addEventListener('mousemove', cancel);
        node.addEventListener('mouseup', cancel);
    }

    node.addEventListener('mousedown', handle_mousedown);

    return {
        destroy() {
            node.removeEventListener('mousedown', handle_mousedown);
        }
    };
}

export const imgToBase64 = (file) => {
    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const base64String = event.target.result;
            resultDiv.innerHTML = `
            <p>Base64:</p>
            <textarea>${base64String}</textarea>
            <p>Imagen:</p>
            <img src="${base64String}" />
          `;
        };

        reader.readAsDataURL(file);
    }
}

export const getRandomTcgCard = async () => {
    pokemon.configure({ apiKey: '35c2a827-0d26-4c7a-898e-9cab6a3e629a' });
    const randomFilter = TcgFilters[Math.floor(Math.random() * TcgFilters.length)];
    let randomCard = Math.floor(Math.random() * 1017);
    let randomPokemon;


    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomCard}`);
        const pokemonData = await response.json(); // Esperar a que se resuelva la promesa
        if (pokemonData) {
            // if query is a number, use the pokemon name
            randomCard = pokemonData.name;
        }
    } catch (e) {
        console.error(e);
    }

    const result = await pokemon.card
        .where({
            q: `( ${randomFilter.code ? `set.id:${randomFilter.code}` : ``} name:"*${randomCard}*" )`,
            select: `id,name,number,supertype,subtypes,rarity,images,types,set`,
            orderBy: `-set.releaseDate,-number`,
            pageSize: 1000
        });

    const cards = result.data || [];

    if (cards.length === 0) {
        // Manejar el caso en el que no se encuentren cartas
        return null;
    } else {
        let card = cards[Math.floor(Math.random() * cards.length)];
        if ( card.rarity === "Common" || card.rarity === "Uncommon" ) {
            card.isReverse = !!Math.round(Math.random());
        }
        card.set = card.set.id;
        randomPokemon = card;

    }

    if (randomPokemon) {
        return randomPokemon;
    }
}

export const getInitialCards = async () => {
    const cards = [];

    while (cards.length < 3) {
        const card = await getRandomTcgCard();
        if (card) {
            cards.push(card);
        }
    }

    return cards;
}