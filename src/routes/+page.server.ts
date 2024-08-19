import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/signin');
	}

	const urls = await locals.pb.collection('links').getFullList({ sort: '-created' });

	console.log(urls);

	return {
		urls
	};
};

export const actions = {
	create: async ({ request, locals }) => {
		let body = Object.fromEntries(await request.formData());
		body.user = locals.user.id;
		try {
			await locals.pb.collection('links').create(body);
		} catch (err) {
			console.log(err);
		}
	}
};
// [
// 	'https://www.youtube.com/watch?v=jfKfPfyJRdk',
// 	'https://www.shadcn-svelte.com/docs/installation/sveltekit',
// 	'https://www.1001fonts.com/bozart-font.html',
// 	'https://www.npmjs.com/package/url-metadata',
// 	'https://www.realtimecolors.com/?colors=d3d3d3-000000-ea2c2c-dedcff-504ae5&fonts=Inter-Inter'
// ]
