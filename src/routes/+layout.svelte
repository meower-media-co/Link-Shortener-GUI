<script>
    import { KeyRound, DoorOpen } from 'lucide-svelte';

    import { page } from '$app/stores';
</script>

<div class="topnav">
    <div class="topnav-inner">
        <a class="{$page.url.pathname === '/' ? 'active' : ''} left" href="/">My Links</a>
        <a class="{$page.url.pathname === '/admin' ? 'active' : ''} left" href="/admin">Admin</a>
        
        <span class="right" on:click={() => { alert(1); }}>
            <DoorOpen class="right" style="cursor: pointer;" size={18} />
        </span>
        <span class="right" on:click={() => { alert(1); }}>
            <KeyRound class="right" style="cursor: pointer;" size={18} />
        </span>
    </div>
</div>

<div class="body">
    <slot />
</div>