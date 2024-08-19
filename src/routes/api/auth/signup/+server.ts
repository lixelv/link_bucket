type SignupBody = {
	username: string;
	password: string;
	passwordConfirm: string;
};

export const POST = async ({ locals, request }) => {
	const body: SignupBody = (await request.json()) as SignupBody;

	if (body.password.length < 8 || body.password.match(/^\d+$/)) {
		return new Response(JSON.stringify({ status: 500, error: 'Password is too weak' }));
	}

	if (body.password !== body.passwordConfirm) {
		return new Response(JSON.stringify({ status: 500, error: 'Passwords do not match' }));
	}

	try {
		await locals.pb.collection('users').create(body);
	} catch (err) {
		return new Response(JSON.stringify({ status: 500, error: 'Username already in use' }));
	}

	try {
		await locals.pb.collection('users').authWithPassword(body.username, body.password);
		return new Response(JSON.stringify({ status: 200 }));
	} catch (err) {
		return new Response(JSON.stringify({ status: 500, error: 'Something went wrong' }));
	}
};
