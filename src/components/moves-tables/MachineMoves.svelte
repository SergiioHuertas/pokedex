<script>
    export let data;
    export let selectedGame;
    export let mainColor;
    export let secondaryColor;

    let machineMovesDetail = [];

    const styleTable = (index) => {
        if (index % 2 === 0) {
            return mainColor;
        } else {
            return secondaryColor;
        }
    }

    $: data?.map(move => {
        if (move.version_group_details?.map(version => version.version_group.name).includes(selectedGame)) {
            machineMovesDetail.push({
                name: move.move.name,
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

    .pokemon-machine-movements {
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

{#if machineMovesDetail.length > 0}
        <div class="pokemon-machine-movements">
            <h3>MACHINE MOVES</h3>
            <table class="pokemon-machine-movements-content">
                <tr>
                    <th>Move</th>
                </tr>
                {#each machineMovesDetail as move, index}
                    <tr style="background-color: {styleTable(index)}" class="pokemon-machine-movement">
                        <th>
                            {move.name}
                        </th>
                    </tr>
                {/each}
            </table>
        </div>
{/if}