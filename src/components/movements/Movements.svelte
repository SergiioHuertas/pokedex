<script>
    import LevelMoves from "../moves-tables/LevelMoves.svelte";
    import MachineMoves from "../moves-tables/MachineMoves.svelte";
    import TutorMoves from "../moves-tables/TutorMoves.svelte";
    export let pokemonData;
    export let error;
    export let loading;

    $: levelMovesData = pokemonData?.moves.filter(move => move.version_group_details?.[0].level_learned_at > 0).sort(
            (a, b) => a.version_group_details?.[0].level_learned_at - b.version_group_details?.[0].level_learned_at
    );

    $: machineMovesData = pokemonData?.moves.filter(move => move.version_group_details?.[0].move_learn_method.name === 'machine')

    $: tutorMovesData = pokemonData?.moves.filter(move => move.version_group_details?.[0].move_learn_method.name === 'tutor')
</script>

<style>
    .movements-container {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        gap: 10%;
        justify-content: center;
        background-color: rgba(0,0,0,0.5);
        border-width: 3px;
        border-style: solid;
        border-image: linear-gradient( to bottom, #000000, rgba(0, 0, 0, 0) ) 1 100%;
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

<div class="movements-container">
    {#if pokemonData}
        {#if levelMovesData?.length > 0}
           <LevelMoves data={levelMovesData}/>
        {/if}
        {#if machineMovesData?.length > 0}
           <MachineMoves data={machineMovesData}/>
        {/if}
        {#if tutorMovesData?.length > 0}
           <TutorMoves data={tutorMovesData}/>
        {/if}
    {:else if error && !loading}
        <div>{error}</div>
    {:else if loading}
        <span class="loader"></span>
    {/if}
</div>