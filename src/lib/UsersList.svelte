<script>
    // @ts-nocheck

    import User from '$lib/User.svelte';

    import { PlusCircle, RefreshCcw } from 'lucide-svelte';

    import { token } from '$lib/stores';
    import { onMount } from 'svelte';

    let loading = true;
    let users = [];

    async function loadUsers() {
        loading = true;
        const resp = await fetch(`https://go.meower.org/admin/db`, {
            headers: {
                Authorization: $token,
            },
        });
        const json = await resp.json();
        users = json.users;
        loading = false;
    }

    onMount(async () => {
        await loadUsers();
    });
</script>

{#if loading}
    <span>Loading...</span>
{:else}
    <span on:click={async () => {
        const username = prompt('Username:');
        if (!username) return;
        const resp = await fetch(`https://go.meower.org/admin/user/${username}`, {
            method: "PUT",
            headers: {
                Authorization: $token,
            },
        });
        if (resp.ok) {
            const json = await resp.json();
            users.push(json);
            users = users;
        } else {
            try {
                var errorMsg = (await resp.json()).error;
            } catch {
                var errorMsg = await resp.text();
            }
            alert(`Error while creating user (${resp.status}): ${errorMsg}`);
        }
    }}>
        <PlusCircle class="right" style="cursor: pointer; margin-right: 10px;" size={28} />
    </span>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span on:click={async () => { await loadUsers(); }}>
        <RefreshCcw class="right" style="cursor: pointer;" size={28} /><br /><br />
    </span>
    {#each users as user}
        <User userId={user._id} username={user.username} token={user.token} admin={user.admin} banned={user.banned} />
    {/each}
{/if}