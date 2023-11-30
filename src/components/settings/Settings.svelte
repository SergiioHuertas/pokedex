<script>
    import {onMount} from "svelte";
    import {getUserData, updateUser} from "../../firebase.js";
    import {Themes} from "../../const/Themes.js";

    let userData;
    let selectedMusic;
    let selectedTheme;
    let volume = 50; // Valor inicial del volumen

    function handleInputChange(event) {
        volume = event.target.value;
    }

    onMount(async () => {
        const sessionUser = sessionStorage.getItem('user');
        await getUserData(JSON.parse(sessionUser).uid).then((user) => {
            if (user) {
                userData = user;
                selectedTheme = userData.background;
                selectedMusic = userData.music;
                volume = userData.volume * 100;
            }
        })
    })

    const saveSettings = async () => {
        selectedTheme = parseInt(document.querySelector('.theme-dropdown select').value);
        selectedMusic = document.querySelector('.music-container input').checked;
        await updateUser(userData.uid, {
            background: selectedTheme,
            music: selectedMusic,
            volume: volume / 100
        });
        window.location.reload();
    }
</script>

<div class="settings-container">
    {#if userData}
        <div class="settings-content">
            <div class="music-container">
                Music on/off
                <!-- Rounded switch checkbox -->
                <label class="switch">
                    <input checked={selectedMusic} type="checkbox">
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="volume-container">
                <label for="volumen">Volume</label> <p>{volume}</p>
                <div class="slider-container">
                    <input
                            type="range"
                            id="volumen"
                            bind:value={volume}
                            min="0"
                            max="100"
                            on:input={handleInputChange}
                            class="volume-slider"
                    />
                </div>
            </div>
            <div class="language-container">
                Language
                <div class="language-dropdown">
                    <select>
                        <option selected value="en">English</option>
                    </select>
                </div>
                (more coming soon)
            </div>
            <div class="theme-container">
                Theme
                <div class="theme-dropdown">
                    <select>
                        {#each Themes as theme}
                            <option selected={theme.id === userData.background} value={theme.id}>{theme.name}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="font-container">
                Font
                <div class="font-dropdown">
                    <select>
                        <option selected value="retro">Retro</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="save-container">
            <button class="save-button" on:click={() => saveSettings()}>Save</button>
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

    .settings-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        width: -webkit-fill-available;
        padding: 20px;
        margin: 30px;
        background: goldenrod;
    }

    .music-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .music-container, .language-container, .theme-container, .font-container, .volume-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 10px;
    }

    .slider-container {
        width: 100%;
        position: relative;
        height: 34px; /* Ajusta la altura según tus preferencias */
        overflow: hidden;
    }

    .volume-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
    }

    /* The switch - the box around the slider */
    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }

    /* Hide default HTML checkbox */
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* The slider */
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    input:checked + .slider {
        background-color: #2196F3;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 34px;
    }

    .slider.round:before {
        border-radius: 50%;
    }

    .save-button {
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