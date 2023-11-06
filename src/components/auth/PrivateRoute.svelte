<script>
    $: user = sessionStorage.getItem("user");

    $: if  (!user) {
        window.location.href = "/";
    }
</script>

{#if user}
    <slot/>
{/if}