<script>
    export let dialog
</script>
<dialog class="dialog-content" bind:this={dialog}>
    <slot/>
</dialog>

<style>
    .dialog-content {
        display: flex;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 5px;
        gap: 5%;
        font-size: 12px;
        font-family: 'Press Start 2P', cursive;
        line-height: 150%;
        width: 60%;
    }
</style>