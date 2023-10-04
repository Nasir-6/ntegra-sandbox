import apiRouter from './router';

// Export a default object containing event handlers
export default {
	// The fetch handler is invoked when this worker receives a HTTP(S) request
	// and should return a Response (optionally wrapped in a Promise)
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// You'll find it helpful to parse the request.url string into a URL object. Learn more at https://developer.mozilla.org/en-US/docs/Web/API/URL
		const url = new URL(request.url);

		if (url.pathname.startsWith('/api/')) {
			// You can also use more robust routing
			return apiRouter.handle(request);
		}

		return new Response(
			`Try making requests to:
      <ul>
      <li><code><a href="/api/todos">/api/todos</a></code></li>
	  </ul>`,
			{ headers: { 'Content-Type': 'text/html' } }
		);
	},
};
