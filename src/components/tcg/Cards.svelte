<script>
	
	import { activeCard } from "../../lib/stores/activeCard.js";
	
	let thisGrid;
	
	$: active = thisGrid && thisGrid.contains( $activeCard );
	
</script>

<div
	class="card-grid" 
	class:active
	bind:this={thisGrid}
>

<slot />

</div>

<style>
	.card-grid {
		display: flex;
		gap: 1%;
		transform-style: preserve-3d;
		padding: 15px;
		overflow-y: auto;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
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
	
	.card-grid.active {
		z-index: 99;
	}

	:global( .card-grid > .card.active ) {
		transform: translate3d(0, 0, 0.1px)!important;
	}

	
</style>
