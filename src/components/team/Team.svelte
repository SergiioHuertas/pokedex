<script context="module">
    import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock'
</script>

<script>
    import { sortable } from 'svelte-agnostic-draggable'
    import CardList from "../tcg/Cards.svelte";

    /**** map all touch events to mouse events ****/

    import mapTouchToMouseFor from 'svelte-touch-to-mouse'
    import {onMount} from "svelte";
    import {getUserData, updateUser} from "../../firebase.js";
    mapTouchToMouseFor('.sortable > div')

    let userData;
    let ListView;
    let ItemViewList = [];
    let newListElements = [];
    let ListElements = [null, null, null];

    onMount(async () => {
        const sessionUser = sessionStorage.getItem('user');
        await getUserData(JSON.parse(sessionUser).uid).then((user) => {
            if (user) {
                userData = user;
                ListElements = userData?.team || [null, null, null];
            }
        })
    })

    /**** Svelte Event Handling ****/

    function onSortableInit ()       {
        // Actualiza ItemViewList solo cuando ListView está definido
        if (ListView) {
            ItemViewList = Array.from(ListView.querySelectorAll('.card-team'));
        }
    }
    function onSortableActivate ()   { disableBodyScroll(document.body) }
    function onSortStart ()          { }
    function onSortMove ()           { }
    function onSortStop ()           { }
    function onSortableOver ()       { }
    function onSortableChange ()     { }
    function onSortableRemove ()     { }
    function onSortableReceive ()    { }
    function onSortableUpdate ()     {
        // Si ItemViewList está vacío, intenta obtenerlo nuevamente
        if (ItemViewList.length === 0) {
            ItemViewList = Array.from(ListView.querySelectorAll('.card-team'));
        }

        const listElementsCopy = [...ListElements];

        const newItemViewList = Array.from(ListView.querySelectorAll('.card-team')).reduce((acc, element, index) => {
            // remove elements that doesn't contain data-card-index
            if (element.getAttribute('data-card-index') !== null) {
                acc.push(element);
            }
            return acc;
        }, []);

        // cambiar el order de ListElements según el order de newItemViewList
        newItemViewList.forEach((element, index) => {
            const cardIndex = element.getAttribute('data-card-index');
            newListElements[index] = listElementsCopy[cardIndex];
        });
    }
    function onSortableOut ()        { }
    function onSortableDeactivate () { enableBodyScroll(document.body) }
    function onSortableDestroy ()    { }

    const addCardToTeam = (card) => {

        if (card.hp == undefined || card.hp == null) {
            alert('You can only add pokemon cards to your team!');
            return;
        }

        if (card.attacks == undefined || card.attacks == null) {
            alert('You can only add pokemon cards with attacks to your team!');
            return;
        }
        // if card already in ListElements, return

        const elementFound = ListElements.find((element) => element?.id == card.id);

        if (elementFound) {
            alert('Card already in team!');
            return;
        }

        const index = ListElements.findIndex((element) => element == null);
        ListElements[index] = card;
        ListElements = [...ListElements];
    }

    const removeCardFromTeam = (index) => {
        ListElements[index] = null;
        ListElements = [...ListElements];
    }

    const saveTeam = async () => {
        if (newListElements.includes(null) || ListElements.includes(null)) {
            alert('You need a full team!');
            return;
        }
        await updateUser(userData.uid, {
            ...userData,
            team: newListElements.length ? newListElements : ListElements
        });

        alert('Team Saved!');
        window.location.href="/team"
    }
</script>

<div class="center-container">
    <div class="team-collection-container">
        {#if userData && userData.collection.length}
            <CardList>
                {#each userData.collection as card, index (card.id)}
                    <img on:click={() => addCardToTeam(card)} src="https://images.pokemontcg.io/{ card.set.toLowerCase() }/{ card.number }_hires.png" />
                {/each}
            </CardList>
        {/if}
    </div>

    <div class="team-container">
        <h1>TEAM</h1>
        <div class="sortable" bind:this={ListView} use:sortable={{
            cursor:'grabbing', zIndex:10
        }} on:sortable:init={onSortableInit} on:sortable:destroy={onSortableActivate}
             on:sortable:activate={onSortableActivate} on:sortable:deactivate={onSortableDeactivate}
             on:sort:start={onSortStart} on:sort:move={onSortMove} on:sort:stop={onSortStop}
             on:sortable:over={onSortableOver} on:sortable:out={onSortableOut}
             on:sortable:change={onSortableChange} on:sortable:update={onSortableUpdate}
             on:sortable:remove={onSortableRemove} on:sortable:receive={onSortableReceive}
        >
            {#each ListElements as ListElement, index }
                <div class="card-team" data-card-index={index}>
                    {#if (ListElement == null)}
                        <img class="team-card" src="https://images.pokemontcg.io/basep/16_hires.png" />
                    {:else}
                        <div class="card-container">
                            <img class="team-card" on:click={() => removeCardFromTeam(index)} src="https://images.pokemontcg.io/{ ListElement.set.toLowerCase() }/{ ListElement.number }_hires.png" />
                        </div>
                    {/if}
                </div>
            {/each}
        </div>

        <button on:click={async () => await saveTeam() } class="team-save">Save</button>
    </div>
</div>

<style>
    div:global(.ui-sortable-placeholder) {
        height: 20px;
    }

    .center-container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .team-collection-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        align-content: center;
        max-width: 100%;
        max-height: 60%;
        height: 60%;
    }

    .team-container {
        background-color: rgba(255,255,255,0.5);
        padding: 10px;
        max-width: 100%;
        height: 40%;
        max-height: 40%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }

    .card-team {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px;
    }

    .sortable > div {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
    }

    .sortable {
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    .card-container {
        width: 100%;
        padding: 5px;
        cursor: grab;
    }

    h1 {
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
        font-size: 20px;
        text-decoration: underline;
        margin: 0; /* Elimina el margen superior predeterminado */
        max-width: 100%; /* Tamaño máximo del título al ancho del contenedor */
        overflow: hidden; /* Oculta el contenido que no cabe */
        text-overflow: ellipsis; /* Agrega puntos suspensivos para indicar que se recortó el texto */
    }

    img {
        width: 14vw;
        cursor: pointer;
    }

    .team-card {
        width: 10vw;
    }

    @media screen and (max-width: 768px) {
        img {
            width: 30vw;
        }

        .team-card {
            width: 28vw;
        }

    }

    .team-save {
        padding: 5px;
        background-color: white;
        border: 1px solid black;
        max-width: 100%;

        &:hover {
            background-color: black;
            color: white;
        }
    }

</style>