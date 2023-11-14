<script>
    import { Router, Route } from 'svelte-routing';

    import Login from './components/auth/Login.svelte';
    import SignUp from './components/auth/SignUp.svelte';
    import FullShowCase from './components/pokedex/FullShowCase.svelte';
    import Profile from './components/profile/Profile.svelte';
    import Team from './components/team/Team.svelte';
    import Battle from './components/battle/Battle.svelte';
    import Collection from './components/collection/Collection.svelte';
    import Summon from './components/summon/Summon.svelte';
    import ComingSoon from './components/coming-soon/ComingSoon.svelte';
    import PrivateRoute from "./components/auth/PrivateRoute.svelte";
    import Navbar from "./components/sidebar/Navbar.svelte";
    import Sidebar from "./components/sidebar/Sidebar.svelte";
    export let url = "";

    let open = false

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
    <Route path="/achievements">
        <PrivateRoute>
            <Sidebar bind:open/>
            <Navbar bind:sidebar={open}/>
            <ComingSoon />
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
            <ComingSoon />
        </PrivateRoute>
    </Route>
</Router>
