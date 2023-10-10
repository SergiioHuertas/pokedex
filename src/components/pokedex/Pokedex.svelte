<script>
    import { Types } from '../../types/types.js';
    import Evolution from "./Evolution.svelte";
    import Icon from 'svelte-icons-pack/Icon.svelte';
    import FaSolidInfoCircle from "svelte-icons-pack/fa/FaSolidInfoCircle";

    import Dialog from "../utils/Dialog.svelte";
    let dialog;
    let abilityDescriptionText;
    let visible = false;

    export let pokemonData;
    export let error;
    export let loading;

    export let triggerSearch;

    export let evolutionChainData;

    const triggerDialog = (description) => {
        abilityDescriptionText = description;
        visible = true;
        console.log(abilityDescriptionText, 'abilityDescriptionText')
        setTimeout(() => {
            if (abilityDescriptionText) {
                dialog.showModal()
            }
        }, 300)
    };

    // fetch abilities description in en language
    $: if (pokemonData.abilities.length) {
        pokemonData.abilities.forEach(ability => {
            fetch(ability.ability.url)
                .then(response => response.json())
                .then(data => {
                    ability.description = data.effect_entries.find(entry => entry.language.name === 'en').effect;
                    console.log(data, 'data' );
                })
                .catch(error => {
                    console.log(error);
                })
        })
    }

</script>

<style>
    .pokedex-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: 35px;
        justify-content: center;
        background-color: rgba(0,0,0,0.5);
        border-width: 3px;
        border-style: solid;
        border-image:
                linear-gradient(
                        to bottom,
                        #000000,
                        rgba(0, 0, 0, 0)
                ) 1 100%;
    }

    .pokedex-number {
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 2px solid white;

        & h3 {
            font-family: 'Press Start 2P', cursive;
            font-size: 22px;
            color: white;
        }
    }

    @property --border-angle {
        syntax: "<angle>";
        inherits: true;
        initial-value: 0turn;
    }

    .pokemonData-images {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        --border-size: 3px;
        --border-angle: 0turn;
        background-image: conic-gradient(
                from var(--border-angle),
                #4c4b4c,
                #112 50%,
                #ffffff
        ),
        conic-gradient(from var(--border-angle), transparent 20%, #fff, #000);
        background-size: calc(100% - (var(--border-size) * 2))
        calc(100% - (var(--border-size) * 2)),
        cover;
        background-position: center center;
        background-repeat: no-repeat;

        animation: bg-spin 3s linear infinite;
        @keyframes bg-spin {
            to {
                --border-angle: 1turn;
            }
        }

        &:hover {
            animation-play-state: paused;
        }

    }

        @media screen and ( min-width: 900px ) {
            .pokemonData-images {
                flex: 1;
            }
        }

    .top-info {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 5%;
        margin: 5px;
    }
    .pokemonData-info {
        flex: 1;
        align-items: center;
        gap: 5%;
        justify-content: center;
        display: flex;
        flex-wrap: wrap;
    }

    .pokemonData-content {
        display: flex;
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: space-between;
        gap: 10%;
        justify-content: center;
        padding: 10px;
        overflow: auto;
    }

    .main-image {
        & img {
            width: 80%;
        }
    }

    .main-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 15px;
        border: 3px solid #000000;
        background-color: darkkhaki;
        & .info-header {
            border-radius: 12px 12px 0 0;
            border-bottom: 2px solid black;
            background-color: #b3ab50;
            display: flex;
            width: 100%;
            justify-content: center;
            color: black;
            padding: 5px;
        }
        & .info-body {
            display: flex;
            flex-direction: column;
            color: black;
            padding: 10px;

            & .info-weight, .info-height, .info-base-experience {
                display: flex;
                justify-content: center;
                align-items: flex-end;
                padding: 5px;
            }
        }
    }

    .pokemonData-stats {
        display: flex;
        border: 3px solid #000004;
        background-color: darkkhaki;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        margin: 5px;
        & .stats-header {
            border-radius: 12px 12px 0 0;
            border-bottom: 2px solid black;
            display: flex;
            width: 100%;
            justify-content: center;
            color: black;
            background-color: #b3ab50;
            padding: 5px;
        }
        & .stats-body {
            display: flex;
            flex-direction: column;
            color: black;
            padding: 10px;

            & .stats-item {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 5px;
            }
        }
    }

    .pokemonData-description {
        display: flex;
        border: 3px solid #000004;
        background-color: darkkhaki;
        flex-direction: column;
        align-items: center;
        border-radius: 15px;
        & .description-header {
            border-radius: 12px 12px 0 0;
            border-bottom: 2px solid black;
            display: flex;
            width: 100%;
            justify-content: center;
            color: black;
            background-color: #b3ab50;
            padding: 5px;
        }
        & .description-body {
            display: flex;
            flex-direction: column;
            color: black;
            padding: 10px;
        }
    }


    .pokemonData-types {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 3px solid #000000;
        background-color: darkkhaki;
        border-radius: 15px;
        margin: 5px;

        & .types-header {
            border-radius: 12px 12px 0 0;
            border-bottom: 2px solid black;
            display: flex;
            width: 100%;
            justify-content: center;
            color: black;
            background-color: #b3ab50;
            padding: 5px;
        }
        & .types-body {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row;
            padding: 10px;

            & .type {
                display: flex;
                flex: 1;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                & img {
                    width: 50%;
                    height: 50%;
                }
            }
        }
    }

    .pokemonData-abilities {
        display: flex;
        border: 3px solid #000000;
        background-color: darkkhaki;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        margin: 5px;
        & .abilities-header {
            display: flex;
            border-radius: 12px 12px 0 0;
            border-bottom: 2px solid black;
            width: 100%;
            justify-content: center;
            color: black;
            padding: 5px;
            background-color: #b3ab50;
        }
        & .abilities-body {
            display: flex;
            flex-direction: column;
            color: black;
            padding: 10px;
        }
    }

    .ability-item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        gap: 5%;
        padding: 5px;
    }

    .dialog-button {
        display: flex;
        margin-top: 20px;
        font-size: 12px;
        font-family: 'Press Start 2P', cursive;
        padding: 5px;
    }

    .dialog-info {
        cursor: pointer;
    }

    strong {
        font-size: 12px;
        font-family: 'Press Start 2P', cursive;
    }

    p {
        font-size: 8px;
        font-family: 'Press Start 2P', cursive;
    }

    .loader {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        box-shadow: inset 0 0 20px -5px rgba(255, 255, 255, 0.5),
        inset 0 -40px 40px -20px rgba(255, 255, 255, 0.5);
        background: linear-gradient(#FF3D00 120px, transparent 0) no-repeat;
        background-position: 0px 120px;
        animation: fillLq 10s linear infinite alternate;
    }
    .loader:before {
        position: absolute;
        content: '';
        width: 40%;
        height: 25%;
        top: 20px;
        left: 10px;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        transform: rotate(-45deg);
    }

    @keyframes fillLq {
        0% , 10% { background-position: 0 120px}
        90% , 100% { background-position: 0 0}
    }

</style>

<div class="pokedex-container">
    {#if pokemonData}
        <!-- pokedex number -->
        <div class="pokedex-number"><h3>{pokemonData.name.toUpperCase()} #{pokemonData.id} </h3></div>

            <div class="pokemonData-content">
                <!--images-->
                <div class="pokemonData-images">
                    <div class="sprites-images">
                        <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
                        <img src={pokemonData.sprites.back_default} alt={pokemonData.name} />
                        <img src={pokemonData.sprites.front_shiny} alt={pokemonData.name} />
                        <img src={pokemonData.sprites.back_shiny} alt={pokemonData.name} />
                    </div>
                    <div class="main-image">
                        <img src={pokemonData.sprites.other['official-artwork'].front_default} alt={pokemonData.name} />
                    </div>

                    <!-- evolution chain -->
                    <Evolution bind:evolutionChainData triggerSearch={triggerSearch}/>
                </div>

                <div class="pokemonData-info">

                    <div class="top-info">

                    <!--description-->
                    <div class="pokemonData-description">
                        <div class="description-header">
                            <strong>Description</strong>
                        </div>
                        <div class="description-body">
                            {#if pokemonData.description}
                                <p>{pokemonData.description}</p>
                            {:else}
                                <p>No description available</p>
                            {/if}
                        </div>
                    </div>

                    <!--general info-->
                    <div class="main-info">
                        <div class="info-header">
                            <strong>General info</strong>
                        </div>
                        <div class="info-body">
                            <div class="info-weight">
                                <strong>Weight:</strong> <p>{pokemonData.weight/10} kgs </p>
                            </div>
                            <div class="info-height">
                                <strong>Height:</strong> <p> {pokemonData.height*10} cms </p>
                            </div>
                            <div class="info-base-experience">
                                <strong>Base experience:</strong> <p> {pokemonData.base_experience} </p>
                            </div>
                        </div>
                    </div>
                    </div>

                    <!--stats-->
                    <div class='pokemonData-stats'>
                        <div class='stats-header'>
                            <strong>Stats</strong>
                        </div>
                        <div class='stats-body'>
                            {#each pokemonData.stats as stat}
                                <div class="stats-item"><strong>{stat.stat.name.toUpperCase()}:</strong> <p>{stat.base_stat}</p> </div>
                            {/each}
                        </div>
                    </div>


                    <!-- abilities with dialog for description-->
                    {#if pokemonData.abilities.length}
                        <div class="pokemonData-abilities">
                            <div class='abilities-header'>
                                <strong>Abilities</strong>
                            </div>
                            <div class='abilities-body'>
                                {#each pokemonData.abilities as ability (ability.ability.name)}
                                    <div class="ability-item">
                                        <strong>{ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}</strong> {ability.is_hidden ? "*" : ""}
                                        {#if ability.description}<div class="dialog-info" on:click={() => triggerDialog(ability.description)}><Icon src={FaSolidInfoCircle} /></div>{/if}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    <!--types-->
                    <div class='pokemonData-types'>
                        <div class='types-header'>
                            <strong>Types</strong>
                        </div>
                        <div class='types-body'>
                            {#each pokemonData.types as type}
                               <div class='type'><img src={`${Types[type.type.name]}`} alt={type.type.name}/> <strong>{type.type.name.toUpperCase()} </strong></div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
    {:else if error && !loading}
        <div>{error}</div>
    {:else if loading}
        <span class="loader"></span>
    {/if}

    {#if visible}
    <Dialog bind:dialog on:close>
        {abilityDescriptionText}
        <button class="dialog-button" on:click={() => {visible = false}}>Got it!</button>
    </Dialog>
    {/if}
</div>