<script>
    import {TcgFilters} from "../../const/TcgFilters.js";
    import {isMobile} from "../../lib/helpers/Common.js";

    export let currentFilter = '';
    export let loadQuery = () => {};
</script>
<!-- if is not mobile show filters -->
{#if !isMobile()}
    <div class="tcg-filters">
        <div class="filter-header">
            Series
        </div>
        <div class="filters">
            {#each TcgFilters as filter}
                {#if filter.code === currentFilter}
                    <div class="filter active" on:click={async () => {currentFilter = ''; await loadQuery();}}>{filter.label}</div>
                {:else}
                    <div class="filter" on:click={async () => {currentFilter = filter.code; await loadQuery(); }}>{filter.label}</div>
                {/if}
            {/each}
        </div>
    </div>
{/if}

<!-- if isMobile show dropdown filters -->
{#if isMobile()}
    <div class="tcg-filters">
        <div class="filter-header">
            Series
        </div>
        <div class="filters">
            <select class="filter" bind:value={currentFilter} on:change={async () => {await loadQuery();}}>
                <option value="">All</option>
                {#each TcgFilters as filter}
                    <option value={filter.code}>{filter.label}</option>
                {/each}
            </select>
        </div>
    </div>
{/if}

<style>
    .tcg-filters {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        padding: 20px;
        background-color: rgba(0,0,0,0.5);
        border-width: 3px;
        border-style: solid;
        border-image: linear-gradient( to bottom, #000000, rgba(0, 0, 0, 0) ) 1 100%;
    }

    .filters {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }

    .filter-header {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        color: white;
    }

    .filter {
        display:inline-block;
        border:1px solid #CCC;
        box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);
        cursor:pointer;
        vertical-align:middle;
        padding: 5px;
        text-align: center;
        border-radius: 5px;
        margin: 5px;
        background: #fff;
        color: #000;
        transition: all 0.2s ease-in-out;

        &:hover {
            background: #000;
            color: #fff;
        }
    }

    .active {
        background: #000;
        color: #fff;
        cursor: pointer;

        &:hover {
            background: #fff;
            color: #000;
        }
    }
</style>