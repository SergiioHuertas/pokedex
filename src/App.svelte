<script>
  import { onMount } from "svelte";
  import pokemon from "pokemontcgsdk";
  import CardList from "./components/tcg/Cards.svelte";
  import Pokedex from "./components/pokedex/Pokedex.svelte";
  import Card from "./components/tcg/CardProxy.svelte";
  import Error from "./components/tcg/Error.svelte";
  import { fade, fly } from 'svelte/transition';
  import Tabs from './components/tabs/Tabs.svelte';
  import Movements from "./components/movements/Movements.svelte";
  import { TabItems, TabIds } from './const/TabItems.js';
  import Search from "./components/search/Search.svelte";
  import Header from "./components/header/Header.svelte";
  import NoData from "./components/no-data/NoData.svelte";

  let showPokedex = false;
  let query = "";
  let lastQuery = "";
  let error = null;
  let loadingPokedex = false;

  let loadingQuery = false;
  let queryTimer;
  let tabTimer;
  let queryResult = [];
  let isError = false;
  let pokemonData = null;
  let evolutionChainData = null;

  const resetState = () => {
	  query = "";
	  lastQuery = "";
	  error = null;
	  loadingPokedex = false;
	  loadingQuery = false;
	  queryTimer = null;
	  tabTimer = null;
	  queryResult = [];
	  isError = false;
	  pokemonData = null;
	  evolutionChainData = null;
  }

  pokemon.configure({ apiKey: import.meta.env.VITE_API_KEY });

  const loadQuery = async() => {
	  // if query is pokedex number, use pokemon name

	lastQuery = query;

    if ( !usableQuery || query.length === 0) {
		return;
    }

    		loadingQuery = true;
    		clearTimeout( queryTimer );
    		queryTimer = setTimeout(() => {
				pokemon.card
    				.where({
    					q: `( set.id:swsh* AND name:"*${query}*" )`,
    					select: `id,name,number,supertype,subtypes,rarity,images,types,set`,
    					orderBy: `-set.releaseDate,-number`,
              			pageSize: 36
    				})
    				.then(result => {
    					const cards = result.data || [];
              			queryResult = [];
              			isError = false;

    					let cardsMap = cards.slice(0, 36).map(card => {
    						if ( card.rarity === "Common" || card.rarity === "Uncommon" ) {
    							card.isReverse = !!Math.round(Math.random());
    						}
    						card.set = card.set.id;
    						return card;
    					});

    					queryResult = [...cardsMap];
							if ( !queryResult.length ) {
								isError = true;
							}
    					loadingQuery = false;
    			  }).catch((a,b,c) => {
              		queryResult = [];
					loadingQuery = false;
              		isError = true;
				});
    		},666);
    	};

		const loadPokedex = async() => {
			loadingPokedex = true; // Update the loading variable directly
			try {
				const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
				const data = await response.json();
				pokemonData = data; // Update the pokemon variable directly
				error = null; // Clear the error
				if (pokemonData) {
					// if query is number use pokemon name
					query = pokemonData.name;
					// get evolution chain
					const response = await fetch(pokemonData.species.url);
					const data = await response.json();
					const evolutionChain = await fetch(data.evolution_chain.url);
					evolutionChainData = await evolutionChain.json();


					// fetcch pokemon description
					const description = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`);
					const descriptionData = await description.json();
					const descriptionText = descriptionData.flavor_text_entries.find((entry) => entry.language.name === 'en');
					pokemonData.description = descriptionText.flavor_text;
				}
			} catch (e) {
				error = 'Pokemon not found'; // Set the error message
				pokemonData = null;
			}
			loadingPokedex = false; // Update loading after the fetch is complete
		}


  $: usableQuery = query.length > 0;

  $: if (query.length === 0) {
	resetState();
  }

  let activeTab = 0, state = 0;
  let slideWrapper, anim;

  function animController() {
	  if(activeTab == state) return;

	  const nodeWidth = slideWrapper.offsetWidth;
	  const currentMultiplier = activeTab > state ? 1 : -1;

 	  anim = {
		  in: nodeWidth * currentMultiplier,
		  out: nodeWidth * -currentMultiplier,
	  };
  }

  const selectActiveTab = () => {
	  clearTimeout( tabTimer );
	  tabTimer = setTimeout(() => {
		  if (pokemonData == null && queryResult.length > 0) {
			  $: activeTab = TabIds.TCG - 1;
		  } else {
			  $: activeTab = TabIds.POKEDEX - 1;
		  }
	  }, 1000);
  };

  const triggerSearch = async (e, newQuery = null) => {
	  e.preventDefault();
	  if (newQuery) {
		  query = newQuery;
	  }
	  if (lastQuery !== query) {
		  await loadQuery();
		  await loadPokedex();
		  selectActiveTab();
	  }
  };

  $: if (slideWrapper) {
	  animController();
	  state = activeTab;
  }
  $: currentTab = TabItems[activeTab];
  $: slideWrapper;
</script>
<Header/>
<Search bind:query triggerSearch={triggerSearch} />
	{#if pokemonData || queryResult.length > 0}
		<Tabs bind:activeTab items={TabItems} />
		{#key currentTab.id}
			<div class="slide-wrapper"
					style="--back: {currentTab.back}"

					bind:this={slideWrapper}
					in:fly={{ x: anim.in, duration: 500, opacity: 1 }}
					out:fly={{ x: anim.out, duration: 500, opacity: 1 }}
			>
				{#if currentTab.id === TabIds.POKEDEX}
					{#if query && pokemonData}
						<Pokedex triggerSearch={triggerSearch} pokemonData={pokemonData} error={error} loading={loadingPokedex} bind:evolutionChainData/>
					{:else if error}
						<Error/>
					{:else if loadingPokedex}
						<h3>Fetching Pokemon...</h3>
						<span class="loader"></span>
					{:else if !loadingPokedex && !pokemonData}
						<h3>Search for a Pokemon</h3>
					{/if}
				{:else if currentTab.id === TabIds.MOVES}
					<Movements bind:pokemonData error={error} loading={loadingPokedex}/>
				{:else if currentTab.id === TabIds.TCG}
					{#if usableQuery && loadingQuery}
						<h3>Fetching Cards...</h3>
						<span class="loader"></span>
					{/if}

					{#if usableQuery && queryResult.length && !loadingQuery}
						<CardList>
							{#each queryResult as card, index (card.id)}
								<Card
										id={card.id}
										name={card.name}
										set={card.set}
										number={card.number}
										types={card.types}
										supertype={card.supertype}
										subtypes={card.subtypes}
										rarity={card.rarity}
										isReverse={card.isReverse}
								/>
							{/each}
						</CardList>
					{/if}

					{#if isError && !loadingQuery && query.length }
						<Error/>
					{/if}
				{/if}
			</div>
		{/key}
	{:else if error && !loadingQuery}
		<Error />
	{:else if loadingQuery}
		<span class="loader"></span>
	{:else}
		<NoData />
	{/if}
<style>
	main {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
	}

	.slide-wrapper {
		align-items: center;
		width: 100%;
		margin-top: 5px;
	}

	@media screen and (max-width: 768px) {
		.slide-wrapper {
		}
	}


	.loader {
		position: relative;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		box-shadow: inset 0 0 20px -5px rgba(255, 255, 255, 0.5),
		inset 0 -40px 40px -20px rgba(255, 255, 255, 0.5);
		background: linear-gradient(#ff0000 120px, transparent 0) no-repeat;
		background-position: 0px 120px;
		animation: fillLq 10s linear infinite alternate;
	}
	.loader:before {
		position: absolute;
		content: '';
		width: 40%;
		height: 25%;
		top: 20px;
		left: 10px;
		background: rgba(255,255,255,0.1);
		border-radius: 50%;
		transform: rotate(-45deg);
	}

	@keyframes fillLq {
		0% , 10% { background-position: 0 120px}
		90% , 100% { background-position: 0 0}
	}
</style>
