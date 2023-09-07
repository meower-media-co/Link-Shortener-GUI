<script lang="ts">
    import User from "$lib/User.svelte";
    import Link from "$lib/Link.svelte";
    import { apiUrl, token, admin, allUsers, allLinks, refreshData } from "$lib";

    import { PlusCircle } from 'lucide-svelte';

    let shownPages: number = 1;
    let links: Array<{ _id: string, creator: string, link: string, redirects: number }> = [];
    $: {
        links = [];
        for (let i = 0; i < shownPages*50 && links.length < $allLinks.length; i++) {
            links.push($allLinks[i]);
        }
    };

    window.addEventListener("scroll", () => {
        const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight;
        if (endOfPage) shownPages++;
    });
</script>

{#if $admin}
    <div class="heading">
        <span style="font-size: 32px;"><b>All Users</b></span>
        <div class="options">
            <button style="cursor: pointer;" on:click={async () => {
                const username = prompt('Username:');
                if (!username) return;
                const resp = await fetch(`${apiUrl}/admin/user/${username}`, {
                    method: "PUT",
                    headers: {
                        Authorization: $token,
                    },
                });
                if (resp.ok) {
                    await refreshData($token);
                } else {
                    let errorMsg;
                    try {
                        errorMsg = (await resp.json()).error;
                    } catch {
                        errorMsg = await resp.text();
                    }
                    alert(`Error while creating user (${resp.status}): ${errorMsg}`);
                }
            }}>
                <PlusCircle size={28} />
            </button>
        </div>
    </div><br />
    {#each $allUsers as user}
        <User id={user._id} username={user.username} token={user.token} admin={user.admin} banned={user.banned} />
    {/each}

    <br />

    <div class="heading">
        <span style="font-size: 32px;"><b>All Links</b></span>
    </div>
    <i>showing {links.length} out of {$allLinks.length} link{$allLinks.length === 1 ? '' : 's'}</i><br /><br />
    {#each links as link}
        <Link id={link._id} creator={link.creator} fullLink={link.link} redirects={link.redirects} deletePath={"/admin/link/"} />
    {/each}
{:else}
    <span>You do not have access to the admin panel.</span>
{/if}