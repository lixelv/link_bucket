<script>
	import { Input } from '$lib/components/ui/input';

	let send = '';
</script>

{@debug send}

{send}

<Input class="w-full" type="text" bind:value={send} on:click={() => (send = '')} />
