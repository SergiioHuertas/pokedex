<script>
    import { Router, Route } from 'svelte-routing';

    import Login from './components/auth/Login.svelte';
    import SignUp from './components/auth/SignUp.svelte';
    import FullShowCase from './components/pokedex/FullShowCase.svelte';
    import Profile from './components/profile/Profile.svelte';
    import Badges from './components/achievements/Badges.svelte';
    import Team from './components/team/Team.svelte';
    import Battle from './components/battle/Battle.svelte';
    import Collection from './components/collection/Collection.svelte';
    import Settings from './components/settings/Settings.svelte';
    import Summon from './components/summon/Summon.svelte';
    import PrivateRoute from "./components/auth/PrivateRoute.svelte";
    import Navbar from "./components/sidebar/Navbar.svelte";
    import Sidebar from "./components/sidebar/Sidebar.svelte";
    import {getUserData} from "./firebase.js";
    import { Themes } from "../src/const/Themes.js"
    export let url = "";

    let open = false

    let background;

    $: (async function () {
        const sessionUser = sessionStorage.getItem('user');
        await getUserData(JSON.parse(sessionUser)?.uid).then((user) => {
            if (user) {
                background = user.background;
                Themes.forEach((theme) => {
                    if (theme.id === background) {
                        document.body.style.backgroundImage = `url(${theme?.img})`;
                    }
                })
            }
        })
    })()

</script>

<svelte:head>
    <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
</svelte:head>

<Router {url}>
    <Route path="/">
        <Login />
    </Route>
    <Route path="/signup">
        <SignUp />
    </Route>
    <Route path="/showCase">
        <PrivateRoute>
            <Sidebar bind:open/>
            <Navbar bind:sidebar={open}/>
            <FullShowCase />
        </PrivateRoute>
    </Route>
    <Route path="/achievements">
        <PrivateRoute>
            <Sidebar bind:open/>
            <Navbar bind:sidebar={open}/>
            <Badges />
        </PrivateRoute>
    </Route>
    <Route path="/profile">
        <PrivateRoute>
            <Sidebar bind:open/>
            <Navbar bind:sidebar={open}/>
            <Profile />
        </PrivateRoute>
    </Route>
    <Route path="/team">
        <PrivateRoute>
            <Sidebar bind:open/>
            <Navbar bind:sidebar={open}/>
            <Team />
        </PrivateRoute>
    </Route>
    <Route path="/collection">
        <PrivateRoute>
            <Sidebar bind:open/>
            <Navbar bind:sidebar={open}/>
            <Collection />
        </PrivateRoute>
    </Route>
    <Route path="/battle">
        <PrivateRoute>
            <Sidebar bind:open/>
            <Navbar bind:sidebar={open}/>
            <Battle />
        </PrivateRoute>
    </Route>
    <Route path="/summon">
        <PrivateRoute>
            <Sidebar bind:open/>
            <Navbar bind:sidebar={open}/>
            <Summon />
        </PrivateRoute>
    </Route>
    <Route path="/settings">
        <PrivateRoute>
            <Sidebar bind:open/>
            <Navbar bind:sidebar={open}/>
            <Settings />
        </PrivateRoute>
    </Route>
</Router>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
        background-repeat: no-repeat;
    }
</style>
