<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { Toaster } from '$lib/components/ui/sonner';

	import { toast } from 'svelte-sonner';
	import { post } from '$lib/utils';
	import { enhance } from '$app/forms';

	let formData = {
		username: '',
		password: '',
		passwordConfirm: ''
	};
</script>

<Toaster position="top-center" richColors theme="system" />
<div class="container mx-auto max-w-md p-6">
	<Card.Root class="my-6">
		<Card.Header>
			<Card.Title>Sign up</Card.Title>
			<Card.Description>Please enter email and password to continue.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				on:submit|preventDefault={async () => {
					const response = await post('/api/auth/signup', formData);
					if (response.error) {
						toast.error(response.error);
					} else {
						window.location.href = '/';
					}
				}}
				use:enhance
			>
				<div class="mb-4">
					<Label class="mb-2 block">Username</Label>
					<Input bind:value={formData.username} type="text" required class="w-full" />
				</div>
				<div class="mb-4">
					<Label class="mb-2 block">Password</Label>
					<Input bind:value={formData.password} type="password" required class="w-full" />
				</div>
				<div class="mb-4">
					<Label class="mb-2 block">Submit password</Label>
					<Input bind:value={formData.passwordConfirm} type="password" required class="w-full" />
				</div>
				<Button type="submit" class="mt-4 w-full">Signup</Button>
			</form>
		</Card.Content>
		<Card.Footer>
			<p class="text-center text-sm">
				Have an account? <a href="/auth/signin" class="text-blue-500">Sign in</a>
			</p>
		</Card.Footer>
	</Card.Root>
</div>
