<script lang="ts">
    import { type link, type user, apiUrl, token as authToken, allUsers, allLinks } from '$lib';

    import { KeyRound, RotateCcw, Shield, Ban, Trash2, Save } from 'lucide-svelte';

    export let id: string = '';
    export let username: string = '';
    export let token: string = '';
    export let admin: boolean = false;
    export let banned: boolean = false;

    let links: Array<link> = [];
    let totalRedirects: number = 0;
    $: {
        links = $allLinks.filter((l: link) => l.creator === username);
        totalRedirects = 0;
        for (const l of links) {
            totalRedirects += l.redirects;
        }
    };

    let updating: boolean = false;

    async function updateUser(newValues: { admin?: boolean, banned?: boolean, token?: boolean }) {
        updating = true;
        const resp = await fetch(`${apiUrl}/admin/user/${username}`, {
            method: "PATCH",
            headers: {
                Authorization: $authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newValues),
        });
        if (resp.ok) {
            const newUser: user = await resp.json();
            id = newUser._id;
            username = newUser.username;
            token = newUser.token;
            admin = newUser.admin;
            banned = newUser.banned;
        } else {
            let errorMsg;
            try {
                errorMsg = (await resp.json()).error;
            } catch {
                errorMsg = await resp.text();
            }
            alert(`Error while updating ${username} (${resp.status}): ${errorMsg}`);
        }
        updating = false;
    }

    async function deleteUser() {
        updating = true;
        const resp = await fetch(`${apiUrl}/admin/user/${username}`, {
            method: "DELETE",
            headers: {
                Authorization: $authToken,
            },
        });
        if (resp.ok) {
            $allUsers = $allUsers.filter((u: user) => u._id !== id);
        } else {
            let errorMsg;
            try {
                errorMsg = (await resp.json()).error;
            } catch {
                errorMsg = await resp.text();
            }
            alert(`Error while deleting ${username} (${resp.status}): ${errorMsg}`);
        }
        updating = false;
    }
</script>

<div class="container">
    <div class="heading">
        <span style="font-size: 22px;">{username}</span>
        <div class="options">
            {#if updating}
                <Save color="orange" />
            {:else if token !== $authToken}
                <button style="cursor: pointer;" on:click={() => { alert(token); }}>
                    <KeyRound />
                </button>
                <button style="cursor: pointer;" on:click={async () => {
                    if (!confirm(`Are you sure you want to reset ${username}'s token?`)) return;
                    await updateUser({ token: true });
                    alert(`New token: ${token}`);
                }}>
                    <RotateCcw />
                </button>
                <button style="cursor: pointer;" on:click={async () => {
                    if (!confirm(`Are you sure you want to ${admin ? 'revoke admin from' : 'grant admin to'} ${username}?`)) return;
                    await updateUser({ admin: !admin });
                }}>
                    <Shield color={admin ? "#23eb5f" : "#ffffff"} />
                </button>
                <button style="cursor: pointer;" on:click={async () => {
                    if (!confirm(`Are you sure you want to ${banned ? 'un' : ''}ban ${username}?`)) return;
                    await updateUser({ banned: !banned });
                }}>
                    <Ban color={banned ? "#eb3723" : "#ffffff"} />
                </button>
                <button style="cursor: pointer;" on:click={async () => {
                    if (!confirm(`Are you sure you want to delete ${username}?\n\nNOTE: This will remove all of their created links. If you want to preserve their links, consider banning them instead.`)) return;
                    await deleteUser();
                }}>
                    <Trash2 />
                </button>
            {/if}
        </div>
    </div><br />
    User ID: {id}<br />
    Total links: {links.length}<br />
    Total redirects: {totalRedirects}<br />
    Admin: {admin ? 'yes' : 'no'}<br />
    Banned: {banned ? 'yes' : 'no'}
</div>