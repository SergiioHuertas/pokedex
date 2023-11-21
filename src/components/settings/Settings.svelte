<script>
    import {onMount} from "svelte";
    import {getUserData} from "../../firebase.js";

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

<div class="settings-container">
    {#if userData}
        <div class="music-container">
            Music on/off
        </div>
        <div class="language-container">
            Coming soon
        </div>
        <div class="theme-container">
            Theme
        </div>
        <div class="font-container">
            Font
        </div>
    {:else}
        <p>Loading...</p>
    {/if}
</div>

<style>
    .settings-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        background-color: rgba(0,0,0,0.5);
        border-width: 3px;
        border-style: solid;
        border-image:
                linear-gradient(
                        to bottom,
                        #000000,
                        rgba(0, 0, 0, 0)
                ) 1 100%;
    }
</style>