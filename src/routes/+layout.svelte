<script>
	import '../app.css';
	import { Button } from '$lib/components/ui/button';
	import { LayoutPanelTop } from 'lucide-svelte';

	export let data;
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<nav class="container flex h-14 max-w-screen-2xl items-center">
		<div class="flex w-full items-center justify-between">
			<LayoutPanelTop />

			<div class="flex gap-4">
				{#if !data.user}
					<Button variant="ghost" href="/auth/signin">Sign in</Button>
					<Button variant="default" href="/auth/signup">Sign up</Button>
				{:else}
					<form action="/api/auth/signout" method="POST">
						<Button variant="ghost" type="submit">Sign out</Button>
					</form>
				{/if}
			</div>
		</div>
	</nav>
</header>

<slot />
