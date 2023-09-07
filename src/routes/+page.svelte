<script lang="ts">
    import Link from "$lib/Link.svelte";
    import { apiUrl, token, myLinks, pendingLinks, refreshData } from "$lib";

    import { PlusCircle } from 'lucide-svelte';

    let shownPages: number = 1;
    let links: Array<{ _id: string, creator: string, link: string, redirects: number }> = [];
    $: {
        links = [];
        for (let i = 0; i < shownPages*50 && links.length < $myLinks.length; i++) {
            links.push($myLinks[i]);
        }
    };

    window.addEventListener("scroll", () => {
        const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight;
        if (endOfPage) shownPages++;
    });
</script>

<div class="heading">
    <span style="font-size: 32px;"><b>My Links</b></span>
    <div class="options">
        <button style="cursor: pointer;" on:click={async () => {
            const _links = prompt('Links (comma-separated):')
            if (!_links) return;
            const links = _links.split(",");
            $pendingLinks = $pendingLinks+links.length;
            for (const _link of links) {
                const link = _link.trim();
                setTimeout(async () => {
                    const resp = await fetch(`${apiUrl}/submit`, {
                        method: "POST",
                        headers: {
                            Authorization: $token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            link: link,
                        }),
                    });
                    if (!resp.ok) {
                        let errorMsg;
                        try {
                            errorMsg = (await resp.json()).error.link;
                        } catch {
                            errorMsg = await resp.text();
                        }
                        alert(`Error while creating link (${resp.status}): ${errorMsg}`);
                    }
                    $pendingLinks = $pendingLinks-1;
                    if ($pendingLinks === 0) await refreshData($token);
                }, 0);
            }
        }}>
            <PlusCircle size={28} />
        </button>
    </div>
</div>
{#if $pendingLinks > 0}
    <i>creating {$pendingLinks} link{$pendingLinks === 1 ? '' : 's'}...</i><br />
{/if}
<i>showing {links.length} out of {$myLinks.length} link{$myLinks.length === 1 ? '' : 's'}</i><br /><br />
{#each links as link}
    <Link id={link._id} creator={link.creator} fullLink={link.link} redirects={link.redirects} deletePath={"/"} />
{/each}