import { Router } from 'itty-router';

const corsHeaders = {
	'Access-Control-Allow-Headers': '*', // What headers are allowed. * is wildcard. Instead of using '*', you can specify a list of specific headers that are allowed, such as: Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Authorization.
	'Access-Control-Allow-Methods': 'POST', // Allowed methods. Others could be GET, PUT, DELETE etc.
	'Access-Control-Allow-Origin': '*', // This is URLs that are allowed to access the server. * is the wildcard character meaning any URL can.
};

type Todo = {
	id: number;
	todo: string;
	isDone: boolean;
};

// now let's create a router (note the lack of "new")
const router = Router();

// GET collection index
router.get('/api/todos', () => {
	const todos: Todo[] = [
		{ id: 1, todo: 'Some Todo', isDone: false },
		{ id: 2, todo: 'Some Todo 2', isDone: true },
	];

	return new Response(JSON.stringify(todos), {
		headers: {
			'Content-type': 'application/json',
			...corsHeaders,
		},
	});
});

// GET item
router.get('/api/todos/:id', ({ params }) => new Response(`Todo #${params.id}`));

// POST to the collection (we'll use async here)
router.post('/api/todos', async (request) => {
	const content = await request.json();

	return new Response('Creating Todo: ' + JSON.stringify(content));
});

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router;
