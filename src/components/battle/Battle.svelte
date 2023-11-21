<script>
    import {getUserData, updateUser} from "../../firebase.js";
    import {onMount} from "svelte";
    import {BattleFields} from "../../const/BattleFields.js";
    import {Characters} from "../../const/Characters.js";
    import {getInitialCards} from "../../lib/helpers/Common.js";
    import {battleEngine} from "../../lib/helpers/BattleEngine.js";
    import { tick } from 'svelte';
    import {isMobile} from "../../lib/helpers/Common.js";
    import { Progressbar } from 'flowbite-svelte';
    import {Badges} from "../../const/Badges.js";

    let userData;
    let userTeam;
    let firstCard;
    let pcTeam;
    let pcFirstCard;
    let battleStarted = false;
    let countdown = 3;
    let showStartButton = true;
    let battleMessages = ['Start the battle!'];
    let userSelectedCard;
    let pcSelectedCard;
    let changeEnabled = false;
    let previousCardDefeated = false;
    let battleWon = false;
    let battleLost = false;
    let randomBattleField;
    let maxCardsHp = [];
    let pcMaxCardsHp = [];
    let currency;
    let battlesWon;
    let userBadges;

    let enemy;

    const scrollToBottom = async (node) => {
        node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
    };

    onMount(async () => {
        enemy = getRandomEnemy();
        randomBattleField = getRandomBattleField();

        const sessionUser = sessionStorage.getItem('user');
        await getUserData(JSON.parse(sessionUser).uid).then((user) => {
            if (user) {
                userData = user;
                userTeam = [...userData?.team];
                userTeam.forEach((card) => {
                    card.attacks = card.attacks.filter(attack => attack.damage !== '')
                    maxCardsHp.push(card.hp);
                })
                currency = userData.money;
                firstCard = userTeam[0]
                userSelectedCard = firstCard;
                battlesWon = userData.battlesWon;
                userBadges = userData.badges;
                // make a copy of the attacks to reset them later
            }
        })
        await getInitialCards().then((cards) => {
            pcTeam = cards;
            pcFirstCard = pcTeam[0];
            pcSelectedCard = pcFirstCard;
            pcTeam.forEach((card) => {
                pcMaxCardsHp.push(card.hp);
            })
        })
    })

    const getRandomBattleField = () => {
        return BattleFields[Math.floor(Math.random() * BattleFields.length)].img;
    }

    const isCardInBattle = (card, cardInBattle) => {
        if (card.id === cardInBattle?.id) {
            return 'card-in-battle';
        }
        return '';
    }

    const isCardAlive = (card) => {
        if (card.hp <= 0) {
            return 'card-defeated';
        }
        return '';
    }

    const getRandomEnemy = () => {
        return Characters[Math.floor(Math.random() * Characters.length)];
    }

    const startBattle = () => {
        // if any of the team cards is null or undefined, return
        if (userTeam.some(card => card === null || card === undefined)) {
            alert('You need to choose 3 cards to start the battle!')
            return;
        }
        showStartButton = false;
        const interval = setInterval(() => {
            countdown--;
            if (countdown === 0) {
                clearInterval(interval);
                battleStarted = true;
            }
        }, 1000);
    };

    const attack = async (attack, isChange = false) => {
        const {userCardHp, pcCardHp, message} = battleEngine(userSelectedCard, pcSelectedCard, attack, isChange);
        userSelectedCard.hp = userCardHp;
        pcSelectedCard.hp = pcCardHp;
        if (!isChange) {
            if (attack === userSelectedCard.attacks[0]) {
                // reduce convertedEnergyCost of all attacks
                userSelectedCard.attacks.forEach(attack => {
                    attack.convertedEnergyCost = attack.convertedEnergyCost - 1;
                })
            } else {
                // reset convertedEnergyCost of all attacks
                userSelectedCard.attacks.forEach(attack => {
                    attack.convertedEnergyCost = attack.cost.length;
                })
            }
        }
        battleMessages = [...battleMessages, message].flat(1);
        await tick();
        await scrollToBottom(document.querySelector('.battle-messages'));
        if (userCardHp <= 0) {
            battleMessages = [...battleMessages, `${userSelectedCard.name} was defeated!`].flat(1);
            battleMessages = [...battleMessages, 'Choose another pokemon!'].flat(1);
            await tick();
            await scrollToBottom(document.querySelector('.battle-messages'));
            forceChange();
        }

        if (pcCardHp <= 0) {
            //if all pc cards hp is 0 you won
            if (pcTeam.every(card => card.hp <= 0) && !battleLost) {
                battleMessages = [...battleMessages, 'You won!'].flat(1);
                battleWon = true;
                battlesWon = battlesWon + 1;
                await tick();
                await scrollToBottom(document.querySelector('.battle-messages'));
                currency = currency + 10;
                // check userData badges and set to obtained true if battles > 10

                Badges.forEach((badge, index) => {
                    if (badge.winsRequired <= battlesWon && !userBadges[index].obtained) {
                        userBadges[index].obtained = true;
                        alert(`You obtained the ${badge.name} badge!`)
                    }
                });

                await updateUser(userData.uid, {
                    money: currency,
                    battlesWon: battlesWon,
                    badges: userBadges
                });
                return;
            }
            battleMessages = [...battleMessages, `${pcSelectedCard.name} was defeated!`].flat(1);
            await tick();
            await scrollToBottom(document.querySelector('.battle-messages'));

            // select another random card
            const pcTeamAlive = pcTeam.filter(card => card.hp > 0);
            pcSelectedCard = pcTeamAlive[Math.floor(Math.random() * pcTeamAlive.length)];
            battleMessages = [...battleMessages, `${pcSelectedCard.name} entered the battle!`].flat(1);
            await tick();
            await scrollToBottom(document.querySelector('.battle-messages'));
        }
    }

    const enableChange = async () => {
        battleMessages = [...battleMessages, 'Change your card!'].flat(1);
        await tick();
        await scrollToBottom(document.querySelector('.battle-messages'));
        changeEnabled = true;
    }

    const changeCard = async (card) => {
        userSelectedCard = card;
        battleMessages = [...battleMessages, 'Card changed!'].flat(1);
        await tick();
        await scrollToBottom(document.querySelector('.battle-messages'));
        changeEnabled = false;
        if (!previousCardDefeated) {
            await attack(card.attacks[0], true)
        }
        previousCardDefeated = false;
    }

    const forceChange = async () => {
        // if all user team hp is 0, you lost
        if (userTeam.every(card => card.hp <= 0)) {
            battleMessages = [...battleMessages, 'You lost!'].flat(1);
            battleWon = false;
            battleLost = true;
            await tick();
            await scrollToBottom(document.querySelector('.battle-messages'));
            return;
        }
        changeEnabled = true;
        previousCardDefeated = true;
    }

    const heal = async () => {
        if (userData.money > 2) {
            currency = currency - 2;
            await updateUser(userData.uid, {
                money: currency
            });
            userSelectedCard.hp = userSelectedCard.hp + 20 > maxCardsHp[userTeam.indexOf(userSelectedCard)] ? maxCardsHp[userTeam.indexOf(userSelectedCard)] : userSelectedCard.hp + 20;
            battleMessages = [...battleMessages, `${userSelectedCard.name} healed 20 HP!`].flat(1);
            await tick();
            await scrollToBottom(document.querySelector('.battle-messages'));
        } else {
            battleMessages = [...battleMessages, `You don't have enough money!`].flat(1);
            await tick();
            await scrollToBottom(document.querySelector('.battle-messages'));
        }
    }

</script>

{#if battleLost || battleWon}
    <div class="start-battle-container" style="background-image: url({randomBattleField})">
        <div class="start-battle-content">
            <div class="start-battle-user-side">
                <div class="start-battle-user-image {battleLost && 'user-defeated'}">
                    <img class="user-photo" src="data:image/png;base64, {userData.photoURL}" alt={'user profile picture'} />
                </div>
                <h2>{userData.nickname}</h2>
            </div>

            <div class="start-battle">
                <h2 class="battle-vs">VS</h2>
            </div>

            <div class="start-battle-pc-side">
                <div class="start-battle-pc-image {battleWon && 'user-defeated'}">
                    <img class="pc-photo" src={enemy.img} alt={'pc profile picture'} />
                </div>
                <h2>{enemy.name}</h2>
            </div>
        </div>

        {#if !isMobile()}
        <div class="battle-messages">
            {#each battleMessages as message}
                {#if (message !== ',' && message !== undefined && message !== '')}
                    <p>{message}</p><br/>
                {/if}
            {/each}
        </div>
        {/if}

        <h2>{battleLost ? "SORRY, YOU HAVE BEEN DEFEATED, TRY AGAIN!" : "CONGRATULATIONS, YOU WON THE BATTLE!" }</h2>
        {#if battleWon}
            <div class="money-earned">
                <h2>+10</h2><img class="coin" src="/assets/images/logos/pokecoin.png" />
            </div>
        {/if}

        <div class="final-buttons">
            <div class="goto-battle" on:click={() => window.location.reload()}>Go to battle</div>
            <div class="goto-summon" on:click={() => window.location.href = "/summon"}>Go to Summon</div>
        </div>

    </div>
{:else if battleStarted && (!pcSelectedCard || !userSelectedCard)}
    <div class="battlefield" style="background-image: url({randomBattleField})">
        <p>Loading...</p>
    </div>
{:else if battleStarted}
    <div class="battlefield" style="background-image: url({randomBattleField})">
        <div class="pc-side">
            {#if pcSelectedCard}
                <div class="pc-team-container">
                    <div class="pc-team-description">
                        <div class="pc-photo-team">
                            <img class="pc-photo-team-img" src={enemy.img} alt={'pc profile picture'} />
                        </div>
                        <h2>{enemy.name} Team</h2>
                    </div>
                    <div class="pc-team">
                        {#each pcTeam as card}
                            <img class="pc-team-card {isCardInBattle(card, pcSelectedCard)} {isCardAlive(card)}" src="https://images.pokemontcg.io/{ card.set.toLowerCase() }/{ card.number }_hires.png" />
                        {/each}
                    </div>
                </div>
                <div class="pc-card-in-battle">
                    <img src="https://images.pokemontcg.io/{ pcSelectedCard.set.toLowerCase() }/{ pcSelectedCard.number }_hires.png" />
                    <Progressbar color="green" progress={(pcSelectedCard.hp * 100) / pcMaxCardsHp[pcTeam.indexOf(pcSelectedCard)]} size="h-3" labelInside={pcSelectedCard.hp} />
                    <p>HP: {pcSelectedCard.hp}</p>
                </div>
            {:else}
                <p>loading...</p>
            {/if}
        </div>

        <div class="user-side">
            {#if userSelectedCard}
                <div class="user-card-in-battle">
                    <img src="https://images.pokemontcg.io/{ userSelectedCard.set.toLowerCase() }/{ userSelectedCard.number }_hires.png" />
                    <Progressbar color="green" progress={(userSelectedCard.hp * 100) / maxCardsHp[userTeam.indexOf(userSelectedCard)]} size="h-3" labelInside={userSelectedCard.hp} />
                    <p>HP: {userSelectedCard.hp}</p>
                </div>
                <div class="user-team-container">
                    <div class="user-team-description">
                        <div class="user-photo-team">
                            <img class="user-photo-team-img" src="data:image/png;base64, {userData.photoURL}" alt={'user profile picture'} />
                        </div>
                        <h2>{userData.nickname} Team</h2>
                    </div>
                    <div class="user-team">
                        {#each userTeam as card}
                            {#if changeEnabled && card.id !== userSelectedCard.id && card.hp > 0}
                                <img style="cursor: pointer" class="user-team-card {isCardInBattle(card, userSelectedCard)}" src="https://images.pokemontcg.io/{ card.set.toLowerCase() }/{ card.number }_hires.png" on:click={() => {changeCard(card)}} />
                            {:else}
                                <img class="user-team-card {isCardInBattle(card, userSelectedCard)} {isCardAlive(card)}" src="https://images.pokemontcg.io/{ card.set.toLowerCase() }/{ card.number }_hires.png" />
                            {/if}
                        {/each}
                    </div>
                </div>
            {:else}
                <p>loading...</p>
            {/if}
        </div>
        <div class="battle-actions">
            <div class="battle-messages">
                {#each battleMessages as message}
                    {#if (message !== ',' && message !== undefined && message !== '')}
                        <p>{message}</p><br/>
                    {/if}
                {/each}
            </div>
            <div class="battle-buttons">
                {#if !changeEnabled}
                <div class="battle-buttons-attack">
                    {#each userSelectedCard.attacks as attackName}
                        {#if attackName.damage !== '' && attackName !== userSelectedCard.attacks[0] && attackName.convertedEnergyCost > 0}
                            <div class="battle-action-attack-disabled">{attackName.convertedEnergyCost}</div>
                        {:else}
                            <div class="batte-action-attack" on:click={() => attack(attackName)}>{attackName.name}</div>
                        {/if}
                    {/each}
                </div>
                <div class="battle-buttons-support">
                    <div class="batte-action-change" on:click={() => enableChange()}>Change</div>
                    <div class="batte-action-heal" on:click={() => heal()}>Heal (-2<img class="small-coin" src="/assets/images/logos/pokecoin.png" />)</div>
                </div>
                {:else}
                    {#if !previousCardDefeated}
                        <div class="batte-action-back" on:click={() => changeEnabled = false}>Back</div>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
{:else if userData}
    <div class="start-battle-container" style="background-image: url({randomBattleField})">
        <div class="start-battle-content">
            <div class="start-battle-user-side">
                <div class="start-battle-user-image">
                    <img class="user-photo" src="data:image/png;base64, {userData.photoURL}" alt={'user profile picture'} />
                </div>
                <h2>{userData.nickname}</h2>
            </div>

            <div class="start-battle">
                <h2 class="battle-vs">VS</h2>
            </div>

            <div class="start-battle-pc-side">
                <div class="start-battle-pc-image">
                    <img class="pc-photo" src={enemy.img} alt={'pc profile picture'} />
                </div>
                <h2>{enemy.name}</h2>
            </div>
        </div>

            {#if showStartButton}
                <div class="start-battle-button" on:click={() => startBattle()}>Start</div>
            {:else}
                <div class="start-battle-countdown">{countdown}</div>
            {/if}
    </div>
{/if}

<style>
    .battlefield {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
    }

    .money-earned {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .coin {
        width: 30px;
        height: 30px;
        margin-right: 5px;
    }

    .small-coin {
        width: 25px;
        height: 25px;
        margin-right: 5px;
    }

    .user-side, .pc-side {
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex: 1;
        width: 100%;
        padding: 15px;
        gap: 10px;
    }

    img {
        width: 200px;
    }

    .user-team-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 3px solid gold;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.5);
        padding: 10px;
    }

    .user-team {
        display: flex;
        justify-content: center;
    }

    .user-team-card {
        width: 10vw;
        margin: 0 1em;
        border: 2px solid black;
    }

    .pc-team-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 3px solid gold;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.5);
        padding: 10px;
    }

    .pc-team {
        display: flex;
        justify-content: center;
    }

    .pc-team-card {
        width: 10vw;
        margin: 0 1em;
        border: 2px solid black;
    }

    .user-card-in-battle {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .pc-card-in-battle {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .card-in-battle {
        border: 3px solid red;
        cursor: default;
    }

    .card-defeated {
        filter: grayscale(100%);
        cursor: default;
    }

    .user-defeated {
        filter: grayscale(100%);
    }

    h2 {
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
        text-decoration: underline;
        margin-bottom: 5px;
    }


    .start-battle-container {
        display: flex;
        justify-content: center;
        align-items: center;
        background-size: cover;
        background-position: center;
        width: 100%;
        height: 100%;
        padding: 2rem;
        flex-direction: column;
    }

    .start-battle-content{
        display: flex;
        align-items: center;
    }

    .start-battle-user-side,
    .start-battle-pc-side {
        flex: 1;
        text-align: center;
    }

    .start-battle-user-side {
        padding: 1rem;
    }

    .start-battle-pc-side {
        padding: 1rem;
    }

    .start-battle-user-image,
    .start-battle-pc-image {
        width: 150px;
        height: 150px;
        margin: 1rem auto;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        border: 3px solid black;
        border-radius: 100%;
    }

    .user-photo, .pc-photo {
        width: 75%;
        max-width: 65px;
    }

    .start-battle {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .battle-vs {
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
        margin-bottom: 5px;
        font-size: 12vw;
        text-decoration: none;
        color: red;

    }

    .start-battle-button {
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
        font-size: 24px;
        text-decoration: none;
        padding: 10px 20px;
        border: 3px solid black;
        border-radius: 10px;
        background-color: white;
        cursor: pointer;

        &:hover {
            background-color: black;
            color: white;
        }
    }

    .battle-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        flex: 1;
        border: 2px solid black;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .battle-messages {
        display: flex;
        flex: 1.5;
        flex-direction: column;
        border: 3px solid gold;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.5);
        margin: 10px;
        align-items: center;
        overflow-y: scroll;
        height: 160px;
    }

    .battle-buttons {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .battle-buttons-attack, .battle-buttons-support {
        display: flex;
        justify-content: space-around;
    }

    .batte-action-heal  {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .batte-action-attack, .batte-action-change, .batte-action-heal, .batte-action-back, .goto-battle, .goto-summon {
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
        font-size: 20px;
        text-decoration: none;
        padding: 10px 20px;
        border: 3px solid black;
        border-radius: 10px;
        background-color: white;
        cursor: pointer;
        margin: 5px;

        &:hover {
            background-color: black;
            color: white;
        }
    }

    .battle-action-attack-disabled {
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
        font-size: 20px;
        text-decoration: none;
        padding: 10px 20px;
        border: 3px solid black;
        border-radius: 10px;
        background-color: #616161;
        cursor: default;
        margin: 5px;
    }

    .start-battle-countdown {
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
        font-size: 48px;
        text-decoration: none;
    }

    .pc-team-description, .user-team-description {
        display: flex;
        align-items: center;
    }

    .pc-photo-team, .user-photo-team {
        width: 50px;
        height: 50px;
        margin: 1rem auto;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        border: 3px solid black;
        border-radius: 100%;
        margin-right: 10px;
    }

    .pc-photo-team-img, .user-photo-team-img {
        width: 55%;
        max-width: 20px;
    }

    .final-buttons {
        display: flex;
        align-items: center;
    }

    @media screen and (max-width: 768px) {
        .start-battle-content {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .batte-action-attack, .batte-action-change, .batte-action-heal, .batte-action-back, .goto-battle, .goto-summon {
            font-size: 12px;
        }

        .battle-messages {
            height: 120px;
        }
    }

</style>