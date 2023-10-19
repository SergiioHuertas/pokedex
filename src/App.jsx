import { useEffect, useRef, useState, useMemo } from "react";
import './App.css'
import { Types } from "./types/types";

function App() {
    const [pokemonName, setPokemonName] = useState('');
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pokemonName) {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            const data = await response.json();
            setPokemon(data);
            setError(null);
        } catch (e) {
            setError('Pokemon not found');
        }
        setLoading(false);
    }

    const searchPokemon = () => {
        return (
            <>
                <form className='pokemon-form' onSubmit={handleSubmit}>
                    <input className='pokemon-input' type="text" name="pokemon-name" id="pokename" placeholder='Pikachu' onChange={(e) => setPokemonName(e.target.value)} value={pokemonName} />
                    <button className='search-button' type="submit">Search</button>
                </form>
            </>
        )
    }

    const showMovements = () => {
        return (
            <>
                <div>
                    <strong>Movements:</strong> {pokemon.moves.map((move) => {
                        return <div>{move.move.name}</div>
                    }
                    )}
                </div>
            </>
        )
    }

    const showAbilities = () => {
        return (
            <>
                <div>
                    <strong>Abilities:</strong> {pokemon.abilities.map((ability) => {
                        return <div>{ability.ability.name}</div>
                    }
                    )}
                </div>
            </>
        )
    }

    const showTypes = () => {
        return (
            <>
                <div className='pokemon-types'>
                    <div className='types-header'>
                        <strong>Types</strong>
                    </div>
                    <div className='types-body'>
                    {pokemon.types.map((type, index) => {
                        return <div key={type.type.name} className={`type type-${index}`}><img src={`${Types[type.type.name]}`} alt={type.type.name}/> <strong>{type.type.name.toUpperCase()} </strong></div>
                    })}
                    </div>
                </div>
            </>
        )
    }

    const showStats = () => {
        return (
            <>
                <div className='pokemon-stats'>
                    <div className='stats-header'>
                    <strong>Stats</strong>
                    </div>
                    <div className='stats-body'>
                    {pokemon.stats.map((stat) => {
                        return <div key={stat.stat.name}><strong>{stat.stat.name.toUpperCase()}:</strong> {stat.base_stat} </div>
                    }
                    )}
                    </div>
                </div>
            </>
        )
    }

    const showSprites = () => {
        return (
            <>
                <div>
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    <img src={pokemon.sprites.back_default} alt={pokemon.name} />
                    <img src={pokemon.sprites.front_shiny} alt={pokemon.name} />
                    <img src={pokemon.sprites.back_shiny} alt={pokemon.name} />
                </div>
            </>
        )
    }

    const showMainImg = () => {
        return (
            <>
                <div>
                    <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
                </div>
            </>
        )
    }

    const showMainInfo = () => {
        return (
            <div className={'main-info'}>
                <div className='info-header'>
                    <strong>General info</strong>
                </div>
                <div className='info-body'>
                <div>
                    <strong>Weight:</strong> {pokemon.weight}
                </div>
                <div>
                    <strong>Height:</strong> {pokemon.height}
                </div>
                <div>
                    <strong>Base experience:</strong> {pokemon.base_experience}
                </div>
                </div>
            </div>
        )
    }


    const showForms = () => {
        return pokemon.forms.length > 2 && (
            <>
                <div>
                    <strong>Forms:</strong> {pokemon.forms.map((form) => {
                        return <div>{form.name}</div>
                    }
                    )}
                </div>
            </>
        )
    }

    const showPokemon = () => {
        return (
            <div className='pokemon-content'>
                <div className={'pokemon-images'}>
                {showSprites()}
                {showMainImg()}
                </div>
                <div className={'pokemon-info'}>
                {showMainInfo()}
                {showStats()}
                {showTypes()}
                {showForms()}
                </div>
            </div>
        )
    }

  return (
    <>
        <img src="/assets/images/logos/Pokedex_logo.png" alt={'pokedex'} />
        {pokemon && !loading && !error && (showPokemon())}
        {error && !loading && <div>{error}</div>}
        {loading && <div>Loading...</div>}
    </>
  )
}

export default App
