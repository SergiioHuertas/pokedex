<script>
    export let data;

    $: tutorMovesDetail = data?.map(move => {
        return {
            name: move.move.name,
            generation: move.version_group_details?.map(version => version.version_group.name).reduce(function (acc, curr) {
                if (!acc.includes(curr))
                    acc.push(curr);
                return acc;
            }, []).join(', ')
        }
    })
</script>
<style>

    table, th, td {
        border: 2px solid black;
    }

    tr:nth-child(even) {
        background-color: #d15d5d;
    }

    tr:nth-child(odd) {
        background-color: #ccbbbb;
    }

    tr:nth-child(1) {
        background-color: #ffffff;
    }

    .pokemon-tutor-movements {
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

        <div class="pokemon-tutor-movements">
            <h3>TUTOR MOVES</h3>
            <table class="pokemon-tutor-movements-content">
                <tr>
                    <th>Move</th>
                    <th>Generation</th>
                </tr>
                {#each tutorMovesDetail as move}
                    <tr class="pokemon-tutor-movement">
                        <th>
                            {move.name}
                        </th>
                        <th>
                            {move.generation}
                        </th>
                    </tr>
                {/each}
            </table>
        </div>