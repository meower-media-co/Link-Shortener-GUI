<script lang="ts">
	import { token } from "./stores";

    export let shortId: string = '';
    export let creator: string = '';
    export let link: string = '';
    export let redirects: number = 0;

    export let deletePath: string = '/';

    let status = '';

    async function deleteLink() {
        const confirmation = confirm(`Are you sure you want to delete ${shortId}?`);
        if (!confirmation) return;
        status = 'Deleting link...';
        const resp = await fetch(`https://go.meower.org${deletePath}${shortId}`, {
            method: "DELETE",
            headers: {
                Authorization: $token,
            },
        });
        if (resp.ok) {
            status = 'Deleted';
        } else {
            try {
                var errorMsg = (await resp.json()).error;
            } catch {
                var errorMsg = await resp.text();
            }
            alert(`Error while deleting ${shortId} (${resp.status}): ${errorMsg}`);
            status = '';
        }
    }
</script>

<div class="container">
    <a href="https://go.meower.org/{shortId}" target="_blank" style="font-size: 22px;">{shortId}</a> {#if status}<span style="margin-left: 5px;"><i>{status}</i></span>{/if}<br /><br />
    Creator: {creator}<br />
    Link: <a href="{link}" target="_blank">{link}</a><br />
    Redirects: {redirects}<br /><br />
    <button on:click={async () => { await deleteLink(); }} disabled={status !== ''}>Delete link</button>
</div>