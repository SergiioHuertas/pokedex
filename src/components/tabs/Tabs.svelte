<script>
    import Tab from "./Tab.svelte";

    export let id = '';
    export let items = [];
    export let activeTab = 0;

    const selectTab = (i) => {
        activeTab = i
    }
</script>

<div class="tabs">
<ul class="tabs-box" {id}>
    {#if Array.isArray(items)}
        {#each items as { label, icon }, i}
            <Tab
                    {label} {icon}
                    isActive={activeTab === i}
                    on:click={() => {selectTab(i)}}
            />
        {/each}
    {/if}
</ul>
</div>

<style>
    ul {
        display: flex;
        flex-direction: row;
        padding-left: 0;
        overflow-x: scroll;
        margin-bottom: 0;
        list-style: none;
        justify-content: space-between;
        width: 100%;
        margin-top: 70px;
        gap: 10px;
    }

    .tabs {
        display: flex;
        width: 100%;
    }
</style>