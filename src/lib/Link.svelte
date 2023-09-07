<script lang="ts">
	import { type link, apiUrl, token, myLinks, allLinks } from "$lib";

    import { Save, Trash2 } from 'lucide-svelte';

    export let id: string = '';
    export let creator: string = '';
    export let fullLink: string = '';
    export let redirects: number = 0;

    export let deletePath: string = '/';

    let updating = false;

    async function deleteLink() {
        updating = true;
        const resp = await fetch(`${apiUrl}${deletePath}${id}`, {
            method: "DELETE",
            headers: {
                Authorization: $token,
            },
        });
        if (resp.ok) {
            $myLinks = $myLinks.filter((l: link) => l._id !== id);
            $allLinks = $allLinks.filter((l: link) => l._id !== id);
        } else {
            let errorMsg;
            try {
                errorMsg = (await resp.json()).error;
            } catch {
                errorMsg = await resp.text();
            }
            alert(`Error while deleting ${id} (${resp.status}): ${errorMsg}`);
        }
        updating = false;
    }
</script>

<div class="container">
    <div class="heading">
        <a href="{apiUrl}/{id}" target="_blank" style="font-size: 22px;">
            {id}
        </a>
        <div class="options">
            {#if updating}
                <Save color="orange" />
            {:else}
                <button style="cursor: pointer;" on:click={async () => {
                    const confirmation = confirm(`Are you sure you want to delete ${id}?`);
                    if (!confirmation) return;
                    await deleteLink();
                }}>
                    <Trash2 />
                </button>
            {/if}
        </div>
    </div><br />
    Creator: {creator}<br />
    Link: <a href="{fullLink}" target="_blank">{fullLink}</a><br />
    Redirects: {redirects}
</div>