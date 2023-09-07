import { writable } from 'svelte/store';

import { tick } from 'svelte';


export type link = {
    _id: string,
    creator: string,
    link: string,
    redirects: number,
};


export type user = {
    _id: string,
    username: string,
    token: string,
    admin: boolean,
    banned: boolean,
};


export const apiUrl: string = "https://go.meower.org";


export const token: any = writable(localStorage.getItem("token") || "");
export const authed: any = writable(false);
export const admin: any = writable(false);

export const myLinks: any = writable([]);
export const allUsers: any = writable([]);
export const allLinks: any = writable([]);

export const pendingLinks: any = writable(0);


export async function refreshData(_token: string) {
    const myLinksResp = await fetch(`${apiUrl}/links`, {
        headers: {
            Authorization: _token,
        },
    });
    if (myLinksResp.ok) {
        const json = await myLinksResp.json();
        myLinks.set(json.links.reverse());
        authed.set(true);
    } else {
        if (myLinksResp.status === 401) {
            alert("Invalid token. Please login again.");
        } else if (myLinksResp.status === 403) {
            alert("You are currently banned. Please contact an admin for more details.");
        } else {
            try {
                var errorMsg: string = (await myLinksResp.json()).error;
            } catch {
                var errorMsg: string = await myLinksResp.text();
            }
            alert(`Unknown error while authenticating (${myLinksResp.status}): ${errorMsg}`);
        }
        token.set("");
    }

    const adminDbResp = await fetch(`${apiUrl}/admin/db`, {
        headers: {
            Authorization: _token,
        },
    });
    if (adminDbResp.ok) {
        const json = await adminDbResp.json();
        admin.set(true);
        allUsers.set(json.users);
        allLinks.set(json.links.reverse());
    } else {
        if (adminDbResp.status !== 401) {
            try {
                var errorMsg: string = (await adminDbResp.json()).error;
            } catch {
                var errorMsg: string = await adminDbResp.text();
            }
            alert(`Unknown error while loading admin database (${adminDbResp.status}): ${errorMsg}`);
        }
        admin.set(false);
        allUsers.set([]);
        allLinks.set([]);
    }
}

token.subscribe(async (_token: string) => {
    if (_token) {
        localStorage.setItem("token", _token);
        await refreshData(_token);
    } else {
        localStorage.removeItem("token");
        await tick();
        token.set(prompt("Please enter your token:", ""));
    }
});