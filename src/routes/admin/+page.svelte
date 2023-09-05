<script>
    import UsersList from '$lib/UsersList.svelte';
    import LinksList from '$lib/LinksList.svelte';
</script>
<span style="font-size: 32px;"><b>Users</b></span><br />
<UsersList />
<br /><br />
<span style="font-size: 32px;"><b>All Links</b></span><br />
<LinksList apiPath={'admin/db'} />