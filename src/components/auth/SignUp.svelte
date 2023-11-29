<script>
    import { firebaseSignUp } from '../../firebase.js';
    import {Themes} from "../../const/Themes.js";

    let email = '';
    let password = '';
    let errorMsg = '';
    let nickname = '';
    let randomTheme = Themes[Math.floor(Math.random() * Themes.length)];
    let loading = false;

    document.body.style.backgroundImage = `url(${randomTheme.img})`;

    async function signUp() {
            loading = true;
            const response = await firebaseSignUp(email, password, nickname);
            const { userData, errorMessage } = response;
            if (userData) {
                window.location.href = '/';
            } else {
                loading = false;
                errorMsg = errorMessage;
            }
    }
</script>

<main>
    {#if loading}
        <h1>Loading...</h1>
    {:else}
        <h1>Sign Up</h1>
        <input type="email" bind:value={email} placeholder="Email" />
        <input type="text" bind:value={nickname} placeholder="Nickname" />
        <input type="password" bind:value={password} placeholder="Password" />
        <div class="signup-buttons">
            <button on:click={() => window.location.href="/"}>Back</button>
            <button on:click={() => signUp()}>Confirm</button>
            {#if errorMsg}
                <p>{errorMsg}</p>
            {/if}
        </div>
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

    .signup-buttons {
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