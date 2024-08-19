import { redirect } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	locals.pb.authStore.clear();
	locals.user = undefined;

	throw redirect(303, '/');
};
