import { toPOJO } from '$lib/utils.js';

export async function load({ locals }) {
	return {
		user: toPOJO(locals.user)
	};
}
