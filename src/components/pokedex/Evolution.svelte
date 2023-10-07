<script>
    export let evolutionChainData;

    export let triggerSearch;

    let prevEvo = evolutionChainData;

    let evolution1 = null;
    let evolution2 = null;
    let evolution3 = null;

    // get evolution chain data
    $: if (evolutionChainData) {
        console.log(prevEvo, 'prevEvo')
        console.log(evolutionChainData, 'evolutionChainData')
        if (prevEvo !== evolutionChainData) {
            prevEvo = evolutionChainData;
            evolution1 = null;
            evolution2 = null;
            evolution3 = null;
        }

        //fetch evolutions data
        if (evolution1 === null) {

            fetch(evolutionChainData.chain.species.url)
                .then(res => res.json())
                .then(data => {
                    console.log(data, 'data')
                    const { id, name } = data;
                    evolution1 = {
                        id,
                        name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                    };
                })
                .catch(err => console.log(err));
        }

        if ((evolution2 === null || evolution2.length === 0) && evolutionChainData.chain.evolves_to.length > 0) {
            const evo2delta = [];
            // fetch for each possible evolution
            evolutionChainData.chain.evolves_to.forEach(async evolution => {
                await fetch(evolution.species.url)
                    .then(res => res.json())
                    .then(data => {
                        const { id, name } = data;
                        evo2delta.push({
                            id,
                            name,
                            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                        });
                    })
                    .catch(err => console.log(err));
            });

            // after evo2delta is fully populated
            setTimeout(() => {
                if (evo2delta.length === evolutionChainData.chain.evolves_to.length) {
                    evolution2 = evo2delta;
                }
            }, 1000);
        }

        if (evolution3 === null) {
            fetch(evolutionChainData.chain.evolves_to[0]?.evolves_to[0]?.species.url)
                .then(res => res.json())
                .then(data => {
                    const { id, name } = data;
                    evolution3 = {
                        id,
                        name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                    };
                })
                .catch(err => console.log(err));
        }
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
    {#if evolution1}
        <div class="evolution1" on:click={(e) => {triggerSearch(e, evolution1.name)}}>
            <img src={evolution1.image} alt={evolution1.name} />
            <p>{evolution1.name}</p>
        </div>
    {/if}
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
    {#if evolution3}
        <svg><line x1="0" y1="70" x2="350" y2="70" stroke="white"></line></svg>
        <div class="evolution3" on:click={(e) => {triggerSearch(e, evolution3.name)}}>
            <img src={evolution3.image} alt={evolution3.name} />
            <p>{evolution3.name}</p>
        </div>
    {/if}
    </div>

</div>