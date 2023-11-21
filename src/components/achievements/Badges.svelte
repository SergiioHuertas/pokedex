<script>
    import {onMount} from "svelte";
    import {getUserData} from "../../firebase.js";
    import {Badges} from "../../const/Badges.js";

    import Dialog from "../utils/Dialog.svelte";
    let dialog;
    let badgeDescriptionText;
    let visible = false;

    let userData;
    let battlesWon;
    let winsRequired;

    onMount(async () => {
        const sessionUser = sessionStorage.getItem('user');
        await getUserData(JSON.parse(sessionUser).uid).then((user) => {
            if (user) {
                userData = user;
                battlesWon = user.battlesWon;
            }
        })
    })

    const triggerDialog = (badge) => {
        badgeDescriptionText = badge.description;
        winsRequired = badge.winsRequired;
        visible = true;
    }

    const isBadgeObtained = (badge) => {
        if (userData.badges) {
            const badgeId = badge.id;
            // get the badge id from the array of badges
            const badgeObtained = userData.badges.find((badge) => badge.id === badgeId);
            if (badgeObtained.obtained) {
                return 'obtained';
            } else {
                return 'not-obtained';
            }
        }
    }
</script>
{#if userData}
    <div class="badges">
        {#each Badges as badge}
                <div class="badge {isBadgeObtained(badge)}" on:click={() => triggerDialog(badge)}>
                    <img src={badge.img} alt={badge.name}/>
                    <p>{badge.name}</p>
                </div>
        {/each}

        {#if visible}
            <Dialog bind:dialog on:close>
                <div class="badge-description">
                    {badgeDescriptionText} <br/>
                    {battlesWon + "/" + winsRequired}
                </div>
                <div class="dialog-button" on:click={() => {visible = false}}>Got it!</div>
            </Dialog>
        {/if}
    </div>
{:else}
    <p>loading...</p>
{/if}

<style>
    .badges {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        width: 100%;
        background-color: rgba(0,0,0,0.5);
        border-width: 3px;
        border-style: solid;
        border-image: linear-gradient( to bottom, #000000, rgba(0, 0, 0, 0) ) 1 100%;
    }

    .badge {
        display: flex;
        border: 3px solid #000;
        border-radius: 10px;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        width: 200px;
        margin: 10px;
        background-color: darkgoldenrod;
        transition: all 0.3s ease-in-out;
        cursor: pointer;

        &:hover {
            border: 3px solid gold;
            background-color: rgba(255, 255, 255, 0.5);
        }
    }

    .badge img {
        width: 50px;
        height: 50px;
    }

    .badge p {
        margin: 0;
        color: gold;
    }

    .dialog-button {
        display: flex;
        margin-top: 20px;
        font-size: 12px;
        font-family: 'Press Start 2P', cursive;
        padding: 5px;
        cursor: pointer;
        border: 3px solid gold;
        background-color: goldenrod;

        &:hover {
            background-color: rgba(255, 255, 255, 0.5);
        }
    }

    .not-obtained {
        filter: grayscale(100%);
    }
</style>
