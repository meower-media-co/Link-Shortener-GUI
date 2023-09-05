<script>
    // @ts-nocheck

    import Link from '$lib/Link.svelte';

    import { PlusCircle, RefreshCcw } from 'lucide-svelte';

    import { token, username } from '$lib/stores';
    import { onMount } from 'svelte';

    export let apiPath = 'links';
    export let showAddButton = false;

    let loading = true;
    let totalLinks = 0;
    let linksPool = [];
    let shownLinks = [];

    async function loadLinks() {
        loading = true;
        const resp = await fetch(`https://go.meower.org/${apiPath}`, {
            headers: {
                Authorization: $token,
            },
        });
        const json = await resp.json();
        totalLinks = json.links.length;
        linksPool = json.links.reverse();
        shownLinks = [];
        for (let i = 0; i < 25 && shownLinks.length < totalLinks; i++) {
            shownLinks.push(linksPool.shift());
        }
        loading = false;
    }

    window.addEventListener("scroll", () => {
        const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight;
        if (endOfPage) {
            for (let i = 0; i < 25 && shownLinks.length < totalLinks; i++) {
                shownLinks.push(linksPool.shift());
            }
            shownLinks = shownLinks;
        }
    });

    onMount(async () => {
        await loadLinks();
    });
</script>

{#if loading}
    <span>Loading...</span>
{:else}
    {#if showAddButton}
    <span on:click={async () => {
        const link = prompt('Link:');
        if (!link) return;
        const resp = await fetch(`https://go.meower.org/submit`, {
            method: "POST",
            headers: {
                Authorization: $token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                link: link,
            }),
        });
        if (resp.ok) {
            const json = await resp.json();
            shownLinks.unshift({
                _id: json.short_id,
                creator: $username,
                link: json.redirect_url,
                redirects: 0,
            });
            shownLinks = shownLinks;
        } else {
            try {
                var errorMsg = (await resp.json()).error.link;
            } catch {
                var errorMsg = await resp.text();
            }
            alert(`Error while creating link (${resp.status}): ${errorMsg}`);
        }
    }}>
        <PlusCircle class="right" style="cursor: pointer; margin-right: 10px;" size={28} />
    </span>
    {/if}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span on:click={async () => { await loadLinks(); }}>
        <RefreshCcw class="right" style="cursor: pointer;" size={28} /><br /><br />
    </span>
    <i>showing {shownLinks.length} out of {totalLinks} links</i><br /><br />
    {#each shownLinks as link}
        <Link shortId={link._id} creator={link.creator} link={link.link} redirects={link.redirects} deletePath={apiPath === 'links' ? '/' : '/admin/link/'} />
    {/each}
{/if}