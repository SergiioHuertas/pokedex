<script>
    export let data;
    export let selectedGame;
    export let mainColor;
    export let secondaryColor;

    const styleTable = (index) => {
        if (index % 2 === 0) {
            return mainColor;
        } else {
            return secondaryColor;
        }
    }
    let levelMovesDetail = [];

    $: data?.map(move => {
        if (move.version_group_details?.map(version => version.version_group.name).includes(selectedGame)) {
            levelMovesDetail.push({
                name: move.move.name,
                level: move.version_group_details?.[0].level_learned_at,
            })
        }
    })
</script>
<style>

    table, th, td {
        border: 2px solid black;
        font-size: 12px;
    }

    th {
        padding: 5px;
    }

    tr:nth-child(even) {
        background-color: #d15d5d;
    }

    tr:nth-child(odd) {
        background-color: #ccbbbb;
    }

    tr:nth-child(1) {
        background-color: #ffffff;

        & th {
            font-family: 'Press Start 2P', cursive;
            font-size: 14px;
            color: black;
        }
    }

    .pokemon-level-movements {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        & h3 {
            font-family: 'Press Start 2P', cursive;
            font-size: 15px;
            color: white;
        }
    }

</style>

{#if levelMovesDetail.length > 0}
        <div class="pokemon-level-movements">
            <h3>LEVEL MOVES</h3>
            <table class="pokemon-level-movements-content">
                <tr>
                    <th>Move</th>
                    <th>Level</th>
                </tr>
                <!-- use index to style -->
                {#each levelMovesDetail as move, index }
                    <tr style="background-color: {styleTable(index)}" class="pokemon-level-movement">
                        <th>
                            {move.name}
                        </th>
                        <th>
                            {move.level}
                        </th>
                    </tr>
                {/each}
            </table>
        </div>
{/if}