<script>
    import { firebaseAuth } from '../../firebase.js';
    import { Themes } from '../../const/Themes.js';

    let email = '';
    let password = '';
    let errorMsg = '';
    let randomTheme = Themes[Math.floor(Math.random() * Themes.length)];
    let loading = false;

    document.body.style.backgroundImage = `url(${randomTheme.img})`;

    $: user = sessionStorage.getItem("user");

    $: if  (user) {
        window.location.href = "/showCase";
    }

    async function login() {
        loading = true;
        const response = await firebaseAuth(email, password);
        const { userData, errorMessage } = response;
        if (userData) {
            const { email, uid } = userData;
            const storableUser = JSON.stringify({ email, uid });
            sessionStorage.setItem("user", storableUser);
            window.location.href = '/showCase';
        } else {
            loading = false;
            errorMsg = errorMessage;
        }
    }
</script>

<main>
    {#if loading}
        <p>Loading...</p>
    {:else}
        <h1>Log in</h1>
        <input type="email" bind:value={email} placeholder="Email" />
        <input type="password" bind:value={password} placeholder="Password" />
        <div class="auth-buttons">
            <button on:click={() => login()}>Login</button>
            <button on:click={() => window.location.href="/signup"}>Sign up</button>
        </div>
        {#if errorMsg}
            <p>{errorMsg}</p>
        {/if}
    {/if}
</main>

<style>
    main {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: black;
    }

    h1 {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 50px;
        font-weight: 700;
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
        color: black;
    }

    input {
        margin: 5px;
    }

    .auth-buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20%;
    }

    button {
        display: flex;
        width: 100%;
        white-space: nowrap;
        padding: 2%;
        border: 3px solid black;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
            background-color: black;
            color: white;
        }
    }
</style>