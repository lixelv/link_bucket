type SigninBody = {
	login: string;
	password: string;
};

export const POST = async ({ locals, request }) => {
	const body: SigninBody = (await request.json()) as SigninBody;

	try {
		await locals.pb.collection('users').authWithPassword(body.login, body.password);
		return new Response(JSON.stringify({ status: 200 }), {
			status: 200
		});
	} catch (err) {
		return new Response(JSON.stringify({ status: 500, error: 'Incorrect login or password' }), {
			status: 200
		});
	}
};
