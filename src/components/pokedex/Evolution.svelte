<script>
    export let evolutionChainData;

    export let triggerSearch;

    let prevEvo = evolutionChainData;

    let promiseEvo1 = null;
    let promiseEvo2 = null;
    let promiseEvo3 = null;

    // get evolution chain data
    $: if (evolutionChainData) {
        if (prevEvo !== evolutionChainData) {
            prevEvo = evolutionChainData;
            promiseEvo1 = null;
            promiseEvo2 = null;
            promiseEvo3 = null;
        }

        //fetch evolutions data

            promiseEvo1 = fetch(evolutionChainData.chain.species.url)
                .then(res => res.json())
                .then(data => {
                    const { id, name } = data;
                    return  {
                        id,
                        name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                    };
                })
                .catch(err => console.log(err));


        if (evolutionChainData.chain.evolves_to.length > 0) {
            const evo2delta = [];
            // fetch for each possible evolution
            evolutionChainData.chain.evolves_to.forEach(async evolution => {
                // await for all evolutions to be fetched

                promiseEvo2 = await fetch(evolution.species.url)
                    .then(res => res.json())
                    .then(data => {
                        const { id, name } = data;
                        evo2delta.push({
                            id,
                            name,
                            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                        });
                        if (evo2delta.length === evolutionChainData.chain.evolves_to.length) {
                            return evo2delta;
                        }
                    })
                    .catch(err => console.log(err));
            });
        }

            promiseEvo3 = fetch(evolutionChainData.chain.evolves_to[0]?.evolves_to[0]?.species.url)
                .then(res => res.json())
                .then(data => {
                    const { id, name } = data;
                    return {
                        id,
                        name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                    };
                })
                .catch(err => console.log(err));
    }
</script>

<style>
    .evolution-chain {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
        gap: 5%;
        background-color: darkkhaki;
    }

    .evolutions {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
    }

    .evolution1 {
        display: flex;
        flex-direction: column;
        border: 1px solid white;
        justify-content: center;
        align-items: center;
        border-radius: 5px;

        &:hover {
            cursor: pointer;
            background: #b3ab50;
        }
    }

    .evolution2 {
        display: flex;
        flex-wrap: wrap;
        border: 1px solid white;
        border-radius: 5px;
        justify-content: center;
        align-items: center;

        & .evolution2-item {
            &:hover {
                cursor: pointer;
                background: #b3ab50;
            }
        }
    }

    .evolution3 {
        display: flex;
        flex-direction: column;
        border: 1px solid white;
        justify-content: center;
        align-items: center;
        border-radius: 5px;

        &:hover {
            cursor: pointer;
            background: #b3ab50;
        }
    }

    svg {
        display: flex;
        width: 5%;
    }

    p, h3 {
        color: white;
        font-size: 10px;
        font-family: 'Press Start 2P', cursive;
    }

    p {
        width: 100%;
        padding: 5px;
    }
</style>

<div class="evolution-chain">
    <h3>Evolution chain</h3>
    <div class="evolutions">
        {#await promiseEvo1 then evo1}
            {#if evo1}
                <div class="evolution1" on:click={(e) => {triggerSearch(e, evo1.name)}}>
                    <img src={evo1.image} alt={evo1.name} />
                    <p>{evo1.name}</p>
                </div>
            {/if}
        {/await}
        {#await promiseEvo2 then evolution2}
            {#if evolution2}
                <svg><line x1="0" y1="70" x2="350" y2="70" stroke="white"></line></svg>
                    <div class="evolution2">
                {#each evolution2 as evolution, index}
                    <div class="evolution2-iteration-{index} evolution2-item" on:click={(e) => {triggerSearch(e, evolution.name)}}>
                        <img src={evolution.image} alt={evolution.name} />
                        <p>{evolution.name}</p>
                    </div>
                {/each}
                    </div>
            {/if}
        {/await}
        {#await promiseEvo3 then evolution3}
            {#if evolution3}
                <svg><line x1="0" y1="70" x2="350" y2="70" stroke="white"></line></svg>
                <div class="evolution3" on:click={(e) => {triggerSearch(e, evolution3.name)}}>
                    <img src={evolution3.image} alt={evolution3.name} />
                    <p>{evolution3.name}</p>
                </div>
            {/if}
        {/await}
    </div>
</div>