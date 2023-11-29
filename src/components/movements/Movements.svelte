<script>
    import LevelMoves from "../moves-tables/LevelMoves.svelte";
    import MachineMoves from "../moves-tables/MachineMoves.svelte";
    import TutorMoves from "../moves-tables/TutorMoves.svelte";
    import IoArrowBackCircleSharp from "svelte-icons-pack/io/IoArrowBackCircleSharp";
    import Icon from 'svelte-icons-pack/Icon.svelte';
    import { GameColors } from "../../const/GameColors.js";
    export let pokemonData;
    export let error;
    export let loading;

    const gamesList = [];
    let selectedGame = null;

    $: pokemonData?.moves.forEach(move => {
         // from level up
         if (move.version_group_details?.[0].level_learned_at > 0 && !gamesList.includes(move.version_group_details?.[0].version_group.name)) {
             gamesList.push(move.version_group_details?.[0].version_group.name);
         }

         // from machine
         if (move.version_group_details?.[0].move_learn_method.name === 'machine' && !gamesList.includes(move.version_group_details?.[0].version_group.name)) {
             gamesList.push(move.version_group_details?.[0].version_group.name);
         }

         // from tutor
         if (move.version_group_details?.[0].move_learn_method.name === 'tutor' && !gamesList.includes(move.version_group_details?.[0].version_group.name)) {
             gamesList.push(move.version_group_details?.[0].version_group.name);
         }
     });

    $: levelMovesData = pokemonData?.moves.filter(move => move.version_group_details?.[0].level_learned_at > 0).sort(
            (a, b) => a.version_group_details?.[0].level_learned_at - b.version_group_details?.[0].level_learned_at
    );

    $: machineMovesData = pokemonData?.moves.filter(move => move.version_group_details?.[0].move_learn_method.name === 'machine')

    $: tutorMovesData = pokemonData?.moves.filter(move => move.version_group_details?.[0].move_learn_method.name === 'tutor')

    $: findSelectedGameColor = (game) => {
        let selectedColor = null;
        let hoverColor = null;
        let mainColor = null;
        let secondaryColor = null;
        if (game?.includes('lets-go-pikachu-lets-go-eevee')) {
            selectedColor = `${GameColors['letsGoPikachu']}, ${GameColors['letsGoEevee']}`;
            mainColor = `${GameColors['letsGoPikachu']}`;
            hoverColor = `${GameColors['letsGoEevee']}, ${GameColors['letsGoPikachu']}`;
            secondaryColor = `${GameColors['letsGoEevee']}`;
        }
        else if (game?.includes('omega-ruby-alpha-sapphire')) {
            selectedColor = `${GameColors['omegaRuby']}, ${GameColors['alphaSaphire']}`;
            mainColor = `${GameColors['omegaRuby']}`;
            hoverColor = `${GameColors['alphaSaphire']}, ${GameColors['omegaRuby']}`;
            secondaryColor = `${GameColors['alphaSaphire']}`;
        }
        else if (game?.includes('black-2-white-2')) {
            selectedColor = `${GameColors['black2']}, ${GameColors['white2']}`;
            mainColor = `${GameColors['black2']}`;
            hoverColor = `${GameColors['white2']}, ${GameColors['black2']}`;
            secondaryColor = `${GameColors['white2']}`;
        }
        else if (game?.includes('ultra-sun-ultra-moon')) {
            selectedColor = `${GameColors['ultraSun']}, ${GameColors['ultraMoon']}`;
            mainColor = `${GameColors['ultraSun']}`;
            hoverColor = `${GameColors['ultraMoon']}, ${GameColors['ultraSun']}`;
            secondaryColor = `${GameColors['ultraMoon']}`;
        }
        else if (game?.includes('-')) {
            const [first, second] = game.split('-');
            selectedColor = `${GameColors[first]}, ${GameColors[second]}`;
            mainColor = `${GameColors[first]}`;
            hoverColor = `${GameColors[second]}, ${GameColors[first]}`;
            secondaryColor = `${GameColors[second]}`;
        } else {
            selectedColor = `${GameColors[game]}, ${GameColors[game]}`;
            mainColor = `${GameColors[game]}`;
            hoverColor = `${GameColors[game]}, ${GameColors[game]}`;
            secondaryColor = `#ccbbbb`;
        }
        return {selectedColor, hoverColor, mainColor, secondaryColor};
    }
</script>

<style>
    .games-container {
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        flex-direction: row;
        justify-content: center;
    }

    .game {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(204, 77, 77, 0.5);
        border: 3px solid black;
        width: 45%;
        height: 50px;
        margin: 5px;
        cursor: pointer;
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
        font-size: 12px;
        text-transform: uppercase;

        &:hover {
            border: 3px solid rgba(255, 255, 255, 0.5);
        }
    }
    .movements-container {
        display: flex;
        width: 100%;
        align-items: baseline;
        gap: 10%;
        justify-content: center;
        background-color: rgba(0,0,0,0.5);
        border-width: 3px;
        border-style: solid;
        border-image: linear-gradient( to bottom, #000000, rgba(0, 0, 0, 0) ) 1 100%;
    }

    .movements-header {
        display: flex;
        margin: 15px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 2%;
        text-transform: uppercase;

        & svg {
            height: 1.5em;
            width: 1.5em;
        }
    }

    h2 {
        display: flex;
        margin: 5px;
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
    }

    .back-icon {
        cursor: pointer;
        display: flex;
        width: max-content;
    }

    .movements-tables {
        display: flex;
        align-items: baseline;
        gap: 5%;
    }

    @media screen and (max-width: 768px) {
        .movements-tables {
            display: flex;
            align-items: baseline;
            gap: 5%;
            flex-wrap: wrap;
            justify-content: center;
        }
    }

    .game-movements {
        display: flex;
        flex-direction: column;
    }

    .loader {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        box-shadow: inset 0 0 20px -5px rgba(255, 255, 255, 0.5),
        inset 0 -40px 40px -20px rgba(255, 255, 255, 0.5);
        background: linear-gradient(#FF3D00 120px, transparent 0) no-repeat;
        background-position: 0 120px;
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
<!-- buttons for different games -->
<div class="games-container">
    {#if !selectedGame}
        {#each gamesList as game}
            <div style="background: linear-gradient(90deg, {findSelectedGameColor(game).selectedColor})" on:click={() => {selectedGame = game}} class="game">{game}</div>
        {/each}
    {:else}
        <div class="movements-container">
            <div class="game-movements">
                <div class="movements-header">
                    <div class="back-icon" on:click={() => selectedGame = null}><Icon color={findSelectedGameColor(selectedGame).mainColor} src={IoArrowBackCircleSharp} /></div>
                    <h2 style="color: {findSelectedGameColor(selectedGame).mainColor}">{selectedGame}</h2>
                </div>
                {#if pokemonData}
                    <div class="movements-tables">
                        {#if levelMovesData?.length > 0}
                           <LevelMoves data={levelMovesData} selectedGame={selectedGame} mainColor={findSelectedGameColor(selectedGame).mainColor} secondaryColor={findSelectedGameColor(selectedGame).secondaryColor}/>
                        {/if}
                        {#if machineMovesData?.length > 0}
                           <MachineMoves data={machineMovesData} selectedGame={selectedGame} mainColor={findSelectedGameColor(selectedGame).mainColor} secondaryColor={findSelectedGameColor(selectedGame).secondaryColor}/>
                        {/if}
                        {#if tutorMovesData?.length > 0}
                           <TutorMoves data={tutorMovesData} selectedGame={selectedGame} mainColor={findSelectedGameColor(selectedGame).mainColor} secondaryColor={findSelectedGameColor(selectedGame).secondaryColor}/>
                        {/if}
                    </div>
                {:else if error && !loading}
                    <div>{error}</div>
                {:else if loading}
                    <span class="loader"></span>
                {/if}
            </div>
        </div>
    {/if}
</div>