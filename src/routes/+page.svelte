<script lang="ts">
	import { pb } from '$lib';
	import { post } from '$lib/utils';
	import { onMount, onDestroy, tick } from 'svelte';
	import { enhance } from '$app/forms';

	import { Ellipsis, SendHorizontal, Trash2, Pencil } from 'lucide-svelte';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';

	type Record = {
		id: string;
		collectionId: string;
		collectionName: string;
		created: string;
		updated: string;
		url: string;
		user: string;
		og: Result;
	};

	type Result = {
		title: string;
		domain: string;
		'img:loaded': boolean | undefined;
		'og:title': string;
		'og:description': string;
		'og:image': string;
		'og:url': string;
		'og:site_name': string;
	};

	export let data: {
		urls: Record[];
	};

	onMount(async () => {
		data.urls.forEach(async (item) => {
			if (!item.og) {
				post('/api/og', item);
			}
		});

		pb.authStore.loadFromCookie(document.cookie);

		pb.collection('links').subscribe('*', async ({ record, action }) => {
			switch (action) {
				case 'create':
					data.urls = [record as Record, ...data.urls];
					await post('/api/og', record);
					break;

				case 'update':
					data.urls = data.urls.map((item) => (item.id === record.id ? (record as Record) : item));
					break;

				case 'delete':
					data.urls = data.urls.filter((item) => item.id !== record.id);
					break;
			}
		});
	});

	onDestroy(() => {
		pb.collection('links').unsubscribe();
	});

	let dt = {
		send: ''
	};
</script>

<div class="container py-10">
	<form
		on:submit|preventDefault={() => {
			setTimeout(() => {
				dt.send = '';
			}, 10);
		}}
		class="flex gap-4 pb-4"
		action="?/create"
		method="POST"
		use:enhance
	>
		<Input name="url" placeholder="https://example.com" bind:value={dt.send} />
		<Button type="submit"><SendHorizontal /></Button>
	</form>
	<div class="grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
		{#each data.urls as item (item.id)}
			<Card.Root class="relative block h-full overflow-hidden">
				<Card.Header class="grid grid-cols-1 p-0">
					{#if item.og['og:image']}
						<a href={item.url}>
							<div class="aspect-[16/9] w-full">
								<img
									loading="lazy"
									class="mb-2 h-full w-full object-cover"
									src={item.og['og:image']}
									alt={item.og['og:title']}
								/>
							</div>
						</a>
					{:else}
						<a href={item.url}>
							<div class="aspect-[16/9] w-full">
								<Skeleton class="mb-2 h-full w-full rounded-none" />
							</div>
						</a>
					{/if}
				</Card.Header>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} variant="ghost" class="absolute bottom-0 right-0 mb-2 mr-2"
							><Ellipsis /></Button
						>
						<div>
							<Card.Header class="pt-4">
								<Card.Title class="w-[80%]">
									{item.og['og:title'] || item.og['title'] || item.og['domain'] || item.url}
								</Card.Title>
							</Card.Header>
						</div>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Label>Actions</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<Dialog.Root>
								<Dialog.Trigger
									class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
									><Pencil class="mr-2 h-4 w-4" />Edit</Dialog.Trigger
								>
								<Dialog.Content>
									<Dialog.Header>
										<Dialog.Title class="mb-2">Edit url</Dialog.Title>
										<Input bind:value={item.url} />
										<Button
											on:click={() => pb.collection('links').update(item.id, item)}
											class="!mt-4">Submit</Button
										>
									</Dialog.Header>
								</Dialog.Content>
							</Dialog.Root>
							<DropdownMenu.Item
								on:click={() => {
									pb.collection('links').delete(item.id);
								}}><Trash2 class="mr-2 h-4 w-4" />Delete</DropdownMenu.Item
							>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Card.Root>
		{/each}
	</div>
	{#if data.urls.length === 0 || !data.urls}
		<Card.Description class="w-full text-center">No records yet.</Card.Description>
	{/if}
</div>
