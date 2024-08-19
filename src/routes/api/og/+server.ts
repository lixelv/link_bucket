import urlMetadata from 'url-metadata';

const linkRegex = /^(https?:\/\/[^\/]+)/g;
const domainRegex = /^https?:\/\/([^\/]+)/g;

export const POST = async ({ request, locals }) => {
	let data = await request.json();

	if (data.og) {
		return new Response(
			JSON.stringify({
				data: null,
				status: 200
			})
		);
	}

	try {
		data.og = await urlMetadata(data.url, {
			timeout: 4000
		});

		if (!data.og['og:image']?.match(linkRegex) && data.og['og:image']) {
			data.og['og:image'] = data.url.match(linkRegex)[0] + data.og['og:image'];
		}

		data.og.domain = data.url.match(domainRegex)[0];

		locals.pb.collection('links').update(data.id, data);

		return new data.og(
			JSON.stringify({
				data: null,
				status: 200
			})
		);
	} catch (err) {
		return new Response(
			JSON.stringify({
				data: null,
				status: 500
			})
		);
	}
};
