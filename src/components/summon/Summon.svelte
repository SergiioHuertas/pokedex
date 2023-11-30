<script>
    import {getUserData} from "../../firebase.js";
    import {SummonTypes} from "../../const/SummonTypes.js";
    import Card from "../tcg/CardProxy.svelte";
    import {getRandomTcgCard} from "../../lib/helpers/Common.js";
    import {updateUser} from "../../firebase.js";
    import {onMount} from "svelte";

    let audio;

    let userData;

    let summonStarted = false;
    let summonFinished = false;
    let cards = [];
    let showPokeball = false;

    let isPokeballClicked = false;
    let ballType = "pokeball";
    let ammount = 1;
    let currency;
    let selectedSummon;
    let musicEnabled;
    let volumeLevel = 0.1;

    onMount(async () => {
        const sessionUser = sessionStorage.getItem('user');
        await getUserData(JSON.parse(sessionUser).uid).then((user) => {
            if (user) {
                userData = user;
                currency = user.money;
                musicEnabled = user.music;
                volumeLevel = user.volume;
            }
        })
    })

    const toggleRotateEffect = () => {
        isPokeballClicked = true;
    }

    const startSummon = async () => {
        summonStarted = true;
        audio = new Audio('/assets/audio/evolution-process.mp3');
        audio.loop = true;
        audio.volume = volumeLevel;
        if (musicEnabled) await audio.play();
        toggleRotateEffect();

        // Ensure a minimum duration of 3 seconds
        const startTime = performance.now();
        while (cards.length < ammount) {
            await getRandomTcgCard().then((cardData) => {
                if (cardData) cards.push(cardData);
            })
        }

        const sessionUser = sessionStorage.getItem('user');
        await getUserData(JSON.parse(sessionUser).uid).then((user) => {
            if (user) {
                userData = user;
            }
        })

        currency -= selectedSummon.price;

        await updateUser(userData.uid, {
            ...userData,
            collection: [...userData.collection, ...cards.map((card) => card)],
            money: currency
        });
        while (performance.now() - startTime < 4000) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        summonFinished = true;
        audio.pause();
        audio.currentTime = 0;
        audio = new Audio('/assets/audio/pokemon-evolve.mp3');
        audio.volume = volumeLevel;
        if (musicEnabled) await audio.play();
    }

    const resetAll = () => {
        summonStarted = false;
        summonFinished = false;
        showPokeball = false;
        isPokeballClicked = false;
        ammount = 1;
        cards = [];
    }

    const showSummon = (type) => {
        if (currency >= type.price) {
            selectedSummon = type;
            ballType = type.class;
            ammount = type.ammount;
            showPokeball = true;
        }
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
        <div class="summon-type" on:click={() => { showSummon(type)}}>
            <div class="summon-type-image">
                <div class="summon-type-price">
                    <img class="coin" src="/assets/images/logos/pokecoin.png" /> {type.price}
                </div>
                <img src={type.banner} alt={type.name} width="200px" />
            </div>
            <div class="summon-type-name">
                <p>{type.name}</p>
                <p>(x{type.ammount})</p>
            </div>
        </div>
        {/each}
    </div>
</div>

{:else if summonFinished}
    <!-- Show the card -->
    <div class="summon-container">
        <div class="summon-cards-container">
            {#each cards as card}
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
        </div>
        <div class="summon-button-container">
            <button on:click={() => resetAll()}>Catch it!</button>
        </div>
    </div>

{:else if showPokeball && !summonFinished}

<div class="pokeball-animation">
    <div class="shadow" class:shadow-effect={isPokeballClicked}></div>
    <div class={ballType} class:rotate-effect={isPokeballClicked} on:click={async () => {if (!summonStarted) await startSummon()}}>
        <div class="reflect" />
        <div class="button" />
    </div>
    <div class="summon-info">
        {#if !isPokeballClicked}
            <p>Press the pokeball to free the pokemon</p>
        {:else}
            <p>Seems like it's opening...</p>
            <p>Please wait, it might take a while...</p>
        {/if}
    </div>
</div>

{/if}

{#if userData}
    <div class="currency"><img class="coin" src="/assets/images/logos/pokecoin.png" /> {currency}</div>
{/if}

<style>
    .coin {
        width: 30px;
        height: 30px;
        margin-right: 5px;
    }
    .currency {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        right: 0;
        margin: 10px;
        font-size: 20px;
        font-weight: bold;
        color: #dfb340;
        text-shadow: 2px 2px 2px black;
    }

    .summon-type-price {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px;
        font-size: 20px;
        font-weight: bold;
        color: #dfb340;
        text-shadow: 2px 2px 2px black;
    }
    .summon-button-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin-top: 30px;
    }
    button {
        display: flex;
        white-space: nowrap;
        padding: 2%;
        cursor: pointer;
        border: 3px solid gold;
        border-radius: 10px;
        background-color: #c1a458;
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
        background-color: rgba(0,0,0,0.5);
        border-width: 3px;
        border-style: solid;
        border-image: linear-gradient( to bottom, #000000, rgba(0, 0, 0, 0) ) 1 100%;
    }

    .summon-cards-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin: 50px 15px 15px 15px;
        padding: 10px;
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
    .pokeball, .superball, .ultraball {
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

    .superball::before {
        content: "";
        position: absolute;
        width: 160px; /* Tamaño reducido */
        height: 0px;
        background: transparent;
        border-radius: 100%;
        margin-top: -2%; /* Ajuste menor */
        margin-left: -1.5%; /* Ajuste menor */
        border-bottom: 82.5px solid transparent; /* Ajuste menor */
        border-top: 82.5px solid #3498db; /* Cambia el color a azul para la Superball */
        border-left: 40px solid #e74c3c; /* Agrega detalles rojos a la izquierda */
        border-right: 40px solid #e74c3c; /* Agrega detalles rojos a la derecha */
        left: 1px;
    }

    .superball::after {
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

    .ultraball::before {
        content: "U";
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 24px;
        color: #ffcc00; /* Amarillo para la letra "U" */
    }

    .ultraball::after {
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