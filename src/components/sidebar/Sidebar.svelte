<script>
    import { onMount } from 'svelte';
    import {getUserData} from "../../firebase.js";
    export let open = false

    let userData;

    onMount(async () => {
        const sessionUser = sessionStorage.getItem('user');
        await getUserData(JSON.parse(sessionUser).uid).then((user) => {
            if (user) {
                userData = user;
            }
        })
    })

    const logout = async () => {
        sessionStorage.removeItem('user');
        window.location.href = '/';
    }
</script>

<aside class="absolute w-full h-full bg-gray-200 border-r-2 shadow-lg" class:open>
    <nav class="text-xl">
        {#if userData}
            <div class="profile-frame">
                <img class='user-photo' src="data:image/png;base64, {userData.photoURL}" alt={'user profile picture'} />
            </div>
            <h1 class="user-name">{userData.nickname}</h1>
            <h2 class="user-email">({userData.email})</h2>
            {#if userData}
                <div class="currency"><img class="coin" src="/assets/images/logos/pokecoin.png" /> {userData.money}</div>
            {/if}
        {/if}
        <button on:click={() => window.location.href="/showCase"} class="hover:text-gray-700 hover:no-underline">Pokedex</button>
        <button on:click={() => window.location.href="/profile"} class="hover:text-gray-700 hover:no-underline">Profile</button>
        <button on:click={() => window.location.href="/achievements"} class="hover:text-gray-700 hover:no-underline">Badges</button>
        <button on:click={() => window.location.href="/team"} class="hover:text-gray-700 hover:no-underline">Team</button>
        <button on:click={() => window.location.href="/collection"} class="hover:text-gray-700 hover:no-underline">Collection</button>
        <button on:click={() => window.location.href="/battle"} class="hover:text-gray-700 hover:no-underline battle">Battle!</button>
        <button on:click={() => window.location.href="/summon"} class="hover:text-gray-700 hover:no-underline">Summon</button>
        <button on:click={() => window.location.href="/settings"} class="hover:text-gray-700 hover:no-underline">Settings</button>
        <button on:click={() => logout()} class="hover:text-gray-700 hover:no-underline logout">Logout</button>
    </nav>
</aside>

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
        position: relative;
        margin: 10px;
        font-size: 20px;
        font-weight: bold;
        color: #dfb340;
        text-shadow: 2px 2px 2px black;
    }

    aside {
        left: -100%;
        transition: left 0.3s ease-in-out;
        z-index: 1000;
        width: 30%;
        display: flex;
        justify-content: center;
        min-height: 100%;
        position: fixed;
        background-color: rgba(0, 0, 0, 0.5);
        border: 3px solid black;
        overflow-y: auto;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;     /* Firefox */
    }

    @media screen and (max-width: 768px) {
        aside {
            left: -100%;
            transition: left 0.3s ease-in-out;
            z-index: 1000;
            width: 100%;
            display: flex;
            justify-content: center;
            min-height: 100%;
            position: fixed;
            background-color: rgba(0, 0, 0, 0.8);
            border: 3px solid black;
            overflow-y: auto;
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;     /* Firefox */
        }
    }

    aside::-webkit-scrollbar { display: none; }

    .open {
        left: 0
    }

    nav {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    a{
        margin-top: 20%;
        width: 40%;
    }

    button {
        padding: 5px;
        margin-top: 10%;
        width: 100%;
        background-color: white;
        border: 1px solid black;

        &:hover {
            background-color: black;
            color: white;
        }
    }

    .profile-frame {
        display: flex;
        width: 150px;
        height: 150px;
        min-height: 150px;
        min-width: 150px;
        justify-content: center;
        align-items: center;
        background-color: white;
        border: 3px solid black;
        border-radius: 100%;
        margin-top: 20px;
    }
    .user-photo {
        width: 75%;
        max-width: 65px;
    }

    .user-name {
        color: white;
        margin-top: 5%;
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
    }

    .user-email {
        font-size: 12px;
        color: white;
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
    }

    .battle {
        background-color: #ff0000;
        color: white;
    }
</style>