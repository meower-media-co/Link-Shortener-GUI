<script>
    import LinksList from '$lib/LinksList.svelte';
</script>
<span style="font-size: 32px;"><b>My Links</b></span><br />
<LinksList apiPath={'links'} showAddButton={true} />