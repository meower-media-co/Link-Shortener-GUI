<script lang="ts">
    import { token as authToken } from '$lib/stores';

    export let userId: string = '';
    export let username: string = '';
    export let token: string = '';
    export let admin: boolean = false;
    export let banned: boolean = false;

    let status: string = '';

    async function updateUserPermissions(toggleAdmin: boolean, toggleBanned: boolean) {
        const confirmation = confirm(`Are you sure you want to change ${username}'s permissions?\n\nNew permissions:\nAdmin: ${toggleAdmin ? !admin : admin ? 'yes' : 'no'}\nBanned: ${toggleBanned ? !banned : banned ? 'yes' : 'no'}`);
        if (!confirmation) return;
        status = 'Updating permissions...';
        const resp = await fetch(`https://go.meower.org/admin/user/${username}`, {
            method: "PATCH",
            headers: {
                Authorization: $authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                admin: toggleAdmin ? !admin : admin,
                banned: toggleBanned ? !banned : banned,
            }),
        });
        if (resp.ok) {
            const json = await resp.json();
            admin = json.admin;
            banned = json.banned;
        } else {
            try {
                var errorMsg = (await resp.json()).error;
            } catch {
                var errorMsg = await resp.text();
            }
            alert(`Error while updating ${username}'s permissions (${resp.status}): ${errorMsg}`);
        }
        status = '';
    }

    async function resetToken() {
        const confirmation = confirm(`Are you sure you want to reset ${username}'s token?`);
        if (!confirmation) return;
        status = 'Resetting token...';
        const resp = await fetch(`https://go.meower.org/admin/user/${username}`, {
            method: "PATCH",
            headers: {
                Authorization: $authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: true,
            }),
        });
        if (resp.ok) {
            const json = await resp.json();
            token = json.token;
        } else {
            try {
                var errorMsg = (await resp.json()).error;
            } catch {
                var errorMsg = await resp.text();
            }
            alert(`Error while resetting ${username}'s token (${resp.status}): ${errorMsg}`);
        }
        status = '';
    }

    async function deleteUser() {
        const confirmation = prompt(`THIS WILL DELETE ALL OF THEIR LINKS!\n\nPlease type ${username}'s username to confirm the deletion:`);
        if (confirmation !== username) {
            if (confirmation) alert('Incorrect username!');
            return;
        };
        status = 'Deleting user...';
        const resp = await fetch(`https://go.meower.org/admin/user/${username}`, {
            method: "DELETE",
            headers: {
                Authorization: $authToken,
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
            alert(`Error while deleting ${username} (${resp.status}): ${errorMsg}`);
            status = '';
        }
    }
</script>

<div class="container">
    <span style="font-size: 22px;">{username}</span> {#if status}<span style="margin-left: 5px;"><i>{status}</i></span>{/if}<br /><br />
    User ID: {userId}<br />
    Token: {token}<br /><br />
    <input id="admin-{userId}" type="checkbox" checked={admin} disabled={status !== ''} on:change={async () => { await updateUserPermissions(true, false); }} />
    <label for="admin-{userId}"> Admin</label><br />
    <input id="banned-{userId}" type="checkbox" checked={banned} disabled={status !== ''} on:change={async () => { await updateUserPermissions(false, true); }} />
    <label for="banned-{userId}"> Banned</label><br /><br />
    <button disabled={status !== ''} on:click={async () => { await resetToken(); }}>Reset token</button> <button disabled={status !== ''} on:click={async () => { await deleteUser(); }}>Delete user</button>
</div>