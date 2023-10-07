<script>
    export let label, isActive, icon;
</script>

<li class='tab-item' class:active={isActive}>
	<div on:keypress on:click>
		<img src={icon} /> <strong>{label}</strong>
	</div>
</li>

<style>
    div {
        height: auto;
        display: flex;
        border-top: 2px solid transparent;
        padding: 1rem;
        cursor: pointer;
        flex-flow: column nowrap;
        justify-content: space-around;
        cursor: pointer;
        text-align: center;
    }

    div:hover {
        color: white;
		background-color: #991919;
		border: 2px solid #090000;
		border-radius: 5px;
    }

	li.active > div:hover {
		color: white;
		background-color: #991919;
		border: 2px solid #090000;
		border-radius: 5px;
	}

    li.active > div {
        color: black;
        border-color: black;
		background-color: #d84848;
		border-radius: 5px;
    }

    li{
		border-radius: 5px;
		background-color: #dad7d4;
        width: 100%;
    }

	strong {
		font-size: 12px;
		font-family: 'Press Start 2P', cursive;
	}

</style>