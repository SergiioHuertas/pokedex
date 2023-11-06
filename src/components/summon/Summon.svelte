<script>
    import {onMount} from "svelte";
    import {getUserData} from "../../firebase.js";
    import {SummonTypes} from "../../const/SummonTypes.js";
    import CardList from "../tcg/Cards.svelte";
    import Card from "../tcg/CardProxy.svelte";
    import {getRandomTcgCard} from "../../lib/helpers/Common.js";
    import {updateUser} from "../../firebase.js";

    let userData;

    let summonStarted = false;
    let summonFinished = false;
    let card;
    let showPokeball = false;

    let isPokeballClicked = false;

    const toggleRotateEffect = () => {
        isPokeballClicked = true;
    }

    const startSummon = async () => {
        summonStarted = true;
        toggleRotateEffect();

        // Ensure a minimum duration of 3 seconds
        const startTime = performance.now();
        while (!card) {
            await getRandomTcgCard().then((cardData) => {
                card = cardData;
            })
        }

        const sessionUser = sessionStorage.getItem('user');
        await getUserData(JSON.parse(sessionUser).uid).then((user) => {
            if (user) {
                userData = user;
            }
        })

        await updateUser(userData.uid, {
            ...userData,
            collection: [...userData.collection, card]
        });
        while (performance.now() - startTime < 4000) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        summonFinished = true;
    }

    const resetAll = () => {
        summonStarted = false;
        summonFinished = false;
        showPokeball = false;
        isPokeballClicked = false;
        card = null;
    }
</script>

{#if !showPokeball && !summonFinished}
<!-- Different types of summons -->
<div class="summon-container">
    <div class="summon-title">
        <h1>Summon a pokemon</h1>
        <p>Choose a summon type</p>
    </div>
    <div class="summon-types">
        {#each SummonTypes as type}
        <div class="summon-type" on:click={() => showPokeball = true}>
            <div class="summon-type-image">
                <div class="summon-type-price">
                    {type.price}
                </div>
                <img src={type.banner} alt={type.name} width="200px" />
            </div>
            <div class="summon-type-name">
                {type.name}
            </div>
        </div>
        {/each}
    </div>
</div>

{:else if summonFinished}
    <!-- Show the card -->
    <div class="summon-container">
        <CardList>
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
        </CardList>
        <button on:click={() => resetAll()}>Catch it!</button>
    </div>

{:else if showPokeball && !summonFinished}

<div class="pokeball-animation">
    <div class="shadow" class:shadow-effect={isPokeballClicked}></div>
    <div class="pokeball" class:rotate-effect={isPokeballClicked} on:click={async () => {if (!summonStarted) await startSummon()}}>
        <div class="reflect" />
        <div class="button" />
    </div>
    <div class="summon-info">
        {!isPokeballClicked ? "Press the pokeball to free the pokemon" : "Seems like it's opening..."}
    </div>
</div>

{/if}

<style>
    button {
        display: flex;
        white-space: nowrap;
        padding: 2%;
        cursor: pointer;
        border: 3px solid gold;
        border-radius: 10px;
        background-color: #dfb340;
        margin-top: 10px;

        &:hover {
            background-color: #f5d78e;
        }
    }

    .summon-container {
        display: flex;
        flex: 1;
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.6);
    }

    .summon-title {
        display: flex;
        flex-direction: column;
        margin-top: 5%;
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        color: #dfb340;
        text-shadow: 2px 2px 2px black;

        & h1 {
            font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
        }

        & p {
            font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
            font-size: 12px;
        }
    }

    .summon-types {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin: 50px 15px 15px 15px;
        padding: 10px;
    }

    .summon-type {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 3px solid gold;
        border-radius: 10px;
        background-color: #dfb340;
        margin: 5px;
        cursor: pointer;
        max-width: 200px;
        max-height: 280px;
        text-align: center;
        padding: 10px;

        &:hover {
            background-color: #f5d78e;
        }
    }

    .summon-type-name {
        font-size: 15px;
        font-weight: bold;
        color: white;
        text-shadow: 2px 2px 2px black;
    }

    .summon-type-image img {
        max-width: 100%;
        height: auto;
    }

    .pokeball-animation {
        position: relative;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.6);
        overflow: hidden;
    }

    .summon-info {
        text-align: center;
        font-size: 18px;
        position: absolute;
        bottom: 30%;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
    }
    .pokeball {
        position: absolute;
        left: 50%;
        top: 40%;
        margin-left: -75px;
        margin-top: -75px;
        background: #333;
        width: 157px; /* Tamaño reducido */
        height: 150px; /* Tamaño reducido */
        border-radius: 100%;
        cursor: pointer;
    }

    .rotate-effect {
        animation: balance 1.5s infinite;
    }



    .shadow-effect {
        animation: moveShadow 1.5s infinite;
    }

    .pokeball::before {
        content: "";
        position: absolute;
        width: 160px; /* Tamaño reducido */
        height: 0px;
        background: transparent;
        border-radius: 100%;
        margin-top: -2%; /* Ajuste menor */
        margin-left: -1.5%; /* Ajuste menor */
        border-bottom: 82.5px solid transparent; /* Ajuste menor */
        border-top: 82.5px solid #e53935;
        left: 1px;
    }
    .pokeball::after {
        content: "";
        position: absolute;
        width: 160px; /* Tamaño reducido */
        height: 0px;
        background: transparent;
        border-radius: 100%;
        margin-top: -0.5%; /* Ajuste menor */
        margin-left: -1.5%; /* Ajuste menor */
        border-bottom: 82.5px solid #eceff1;
        border-top: 82.5px solid transparent;
        left: 1px;
    }

    .button {
        position: absolute;
        width: 65px; /* Tamaño reducido */
        height: 65px; /* Tamaño reducido */
        background: #333;
        margin-left: -32.5px; /* Tamaño reducido */
        margin-top: -32.5px; /* Tamaño reducido */
        top: 53%;
        left: 50%;
        z-index: 100;
        border-radius: 100%;
    }
    .button::before {
        content: "";
        position: absolute;
        width: 50px; /* Tamaño reducido */
        height: 50px; /* Tamaño reducido */
        left: 50%;
        top: 50%;
        margin-left: -25px; /* Tamaño reducido */
        margin-top: -25px; /* Tamaño reducido */
        border-radius: 100%;
        background: #eceff1;
    }
    .button::after {
        content: "";
        position: absolute;
        width: 30px; /* Tamaño reducido */
        height: 30px; /* Tamaño reducido */
        left: 50%;
        top: 50%;
        margin-left: -15px; /* Tamaño reducido */
        margin-top: -15px; /* Tamaño reducido */
        border-radius: 100%;
        border: 5px solid #333;
        animation: alert 0.3s infinite;
    }
    .reflect {
        position: absolute;
        width: 150px; /* Tamaño reducido */
        height: 150px; /* Tamaño reducido */
        margin-top: -2%; /* Ajuste menor */
        margin-left: -2%; /* Ajuste menor */
    }
    .reflect::before {
        content: "";
        width: 160px; /* Tamaño reducido */
        height: 150px; /* Tamaño reducido */
        position: absolute;
        border-radius: 100%;
        border-bottom: 14px solid #333; /* Ajuste menor */
        opacity: 0.05;
        margin-left: 1%;
        margin-top: 3%;
        z-index: 100;
        left: 1px;
        top: 15px;
    }
    .shadow {
        position: absolute;
        top: 40%;
        left: 50%;
        margin-top: 61.5px; /* Tamaño reducido */
        margin-left: -75px;
        width: 150px; /* Tamaño reducido */
        height: 50px; /* Tamaño reducido */
        opacity: 0.1;
        border-radius: 100%;
        transform: rotateX(80deg);
        box-shadow: inset 0px 0px 140px #757575; /* Ajuste menor */
    }

    @keyframes alert{
        100%{background:#ffcdd2; box-shadow:0px 0px 30px #ffcdd2;}
    }
    @keyframes balance{
        0%{transform:translateX(0px) rotate(0deg) ; }
        25%{transform:translateX(-50px) rotate(-40deg); }
        50%{transform:translateX(50px) rotate(40deg); }
    }
    @keyframes moveShadow{
        0%{ transform:translateX(0px) rotateX(80deg);}
        25%{transform:translateX(-50px) rotateX(80deg);;}
        50%{transform:translateX(50px) rotateX(80deg);;}
    }
    @keyframes moveReflect {
        0% { transform: rotateX(0deg); }
        25% { transform: rotateX(5deg); }
        50% { transform: rotateX(-5deg); }
        100% { transform: rotateX(0deg); }
    }

</style>