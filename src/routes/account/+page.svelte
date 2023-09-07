<script lang="ts">
    import { apiUrl, token, myLinks } from "$lib";

    import { KeyRound, RotateCcw, LogOut } from 'lucide-svelte';

    let totalRedirects: number = 0;
    $: {
        totalRedirects = 0;
        for (const l of $myLinks) {
            totalRedirects += l.redirects;
        }
    };
</script>

<div class="heading">
    <span style="font-size: 32px;"><b>My Account</b></span>
    <div class="options">
        <button style="cursor: pointer;" on:click={() => { alert($token); }}>
            <KeyRound size={28} />
        </button>
        <button style="cursor: pointer;" on:click={async () => {
            const confirmation = confirm("Are you sure you want to reset your token?\n\nThis will prevent any current bots or other services from making new links!");
            if (!confirmation) return;
            const resp = await fetch(`${apiUrl}/refresh`, {
                method: "GET",
                headers: {
                    Authorization: $token,
                },
            });
            if (resp.ok) {
                let _token = (await resp.json()).token;
                alert(`Here's your new token: ${_token}`);
                $token = _token;
            } else {
                let errorMsg;
                try {
                    errorMsg = (await resp.json()).error.link;
                } catch {
                    errorMsg = await resp.text();
                }
                alert(`Error while refreshing token (${resp.status}): ${errorMsg}`);
            }
        }}>
            <RotateCcw size={28} />
        </button>
        <button style="cursor: pointer;" on:click={async () => {
            const confirmation = confirm("Are you sure you want to logout?");
            if (!confirmation) return;
            localStorage.clear();
            window.location.reload();
        }}>
            <LogOut size={28} />
        </button>
    </div>
</div><br />
Total links: {$myLinks.length}<br />
Total redirects: {totalRedirects}