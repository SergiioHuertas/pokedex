<script>
    export let query;
    export let triggerSearch;

</script>
<style>
    .search-area {
        font-size: 18px;
        display: flex;
        place-items: center start;
        padding: 5px;
        border-radius: 0.66em;
        backdrop-filter: blur(5px);
        margin: 10px 0 0 0;
        width: 100%;
        flex-wrap: wrap;
    }

    @media screen and ( min-width: 768px ) {
        .search-area {
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
            margin: 10px 0 0 0;
            font-size: 22px;
            flex-direction: row;
            width: 40%;
            flex-wrap: wrap;
        }
        h3 {
            margin-inline: 60px;
        }
    }

    #example-form {
        width: 100%;
    }

    input {
        &:placeholder-shown {
            text-overflow: ellipsis;
        }
        font-family: 'Press Start 2P', Roboto,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;
        font-size: 16px;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: .5em;
        margin: 0;
        background: hsla(220, 7%, 17%, .66);
        color: white;
        outline: none;
        transition: all 0.5s ease;
        box-shadow: 0 5px 20px hsla(220, 7%, 20%, .75), 0 5px 10px hsla(220, 7%, 20%, .75);

        grid-row: 1;
        grid-column: 1;
        width: 100%;
        padding: 10px 50px 10px 10px;
    }

    input:active,
    input:focus,
    input:hover {
        background: hsla(220, 7%, 17%, .88);
    }

    input:active,
    input:focus {
        border: 1px solid var(--primary);
    }

    .icon-tabler-search {
        grid-row: 1;
        grid-column: 1;
        place-self: center end;
        margin-right: 10px;
        opacity: 0.5;
        transition: all 0.5s ease;
    }

    .icon:hover {
        opacity: 1;
        color: white;
        cursor: pointer;
        transform: scale(1.2);
    }
    input:active + .icon,
    input:focus + .icon,
    input:hover + .icon {
        opacity: 0.2;
    }

    h3 {
        font-family: 'Press Start 2P', Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif ;
        font-size: inherit;
        font-weight: normal;
        margin-block: 10px;
        margin-top: 45px;
    }
</style>
<section class="search-area">

    <form id="example-form" on:submit={(e) => triggerSearch(e)}>
        <input type="search" pattern="^[a-zA-Z0-9 -.]*$" name="search" id="search" bind:value={query} placeholder="Pikachu" />
    </form>

    <svg on:click={(e) => triggerSearch(e)} on:keydown={(e) => triggerSearch(e)} xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.25" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
        <path d="M21 21l-6 -6"></path>
    </svg>

</section>