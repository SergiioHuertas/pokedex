<script>
    import {onMount} from "svelte";
    import {getUserData} from "../../firebase.js";
    import CardList from "../tcg/Cards.svelte";
    import Card from "../tcg/CardProxy.svelte";

    let userData;

    onMount(async () => {
        const sessionUser = sessionStorage.getItem('user');
        await getUserData(JSON.parse(sessionUser).uid).then((user) => {
            if (user) {
                userData = user;
            }
        })
    })
</script>

{#if userData && userData.collection.length}
    <CardList>
        {#each userData.collection as card, index (card.id)}
            <Card
                    id={card.id}
                    name={card.name}
                    set={card.set}
                    number={card.number}
                    types={card.types}
                    supertype={card.supertype}
                    subtypes={card.subtypes}
                    rarity={card.rarity}
                    isReverse={card.isReverse}
            />
        {/each}
    </CardList>
{/if}