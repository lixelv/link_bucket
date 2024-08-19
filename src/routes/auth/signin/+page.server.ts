import { error, redirect } from '@sveltejs/kit';

export const load = ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/');
	} else {
		return {};
	}
};
