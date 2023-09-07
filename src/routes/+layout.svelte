<script>
    import { Home, Shield, RefreshCcw, User } from 'lucide-svelte';

    import { token, authed, admin, refreshData } from '$lib';
</script>

<div class="topnav">
    <div class="topnav-inner">
        <a class="left" style="cursor: pointer;" href="/">
            <Home />
        </a>
        <a class="left" style="cursor: pointer;" href="/admin">
            <Shield />
        </a>

        <a class="right" style="cursor: pointer;" href="/account">
            <User class="right" />
        </a>

        <button class="right" style="cursor: pointer;" on:click={async () => {
            $authed = false;
            await refreshData($token);
        }}>
            <RefreshCcw class="right" />
        </button>
    </div>
</div>

<div class="page">
    {#if $authed}
        <slot />
    {:else}
        <span>Loading data...</span>
    {/if}
</div>