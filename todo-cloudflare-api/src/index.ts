import { Router, RouterType } from 'itty-router';
import faunadb, { Collection, Documents, Get, Paginate, Ref, Query, Map, Index, Select, Create, Let, Var } from 'faunadb';

export interface Env {
	FAUNADB_SECRET?: string;
	router?: RouterType;
}

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

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (env.router === undefined) {
			env.router = buildRouter(env);
		}

		return env.router.handle(request);
	},
};

function buildRouter(env: Env): RouterType {
	const router = Router();

	const isLocalEnv = env.FAUNADB_SECRET;
	const dbkey = isLocalEnv ? env.FAUNADB_SECRET : FAUNADB_SECRET;

	const faunaClient = new faunadb.Client({
		secret: dbkey,
	});

	router.get('/api/todos', async (request, env) => {
		const dbQuery = await faunaClient.query(getAllTodos());
		return new Response(JSON.stringify(dbQuery), {
			headers: {
				'Content-type': 'application/json',
				...corsHeaders,
			},
		});
	});

	router.post('/api/todos', async (request, env) => {
		console.log('POSTING');
		const content = await request.json();
		const resObj = await faunaClient.query(addTodo(content.todo));
		const newTodoObj = {
			id: resObj.ref.id,
			todo: resObj.data.todo,
			isDone: resObj.data.isDone,
		};
		return new Response(JSON.stringify(newTodoObj), {
			headers: {
				'Content-type': 'application/json',
				...corsHeaders,
			},
		});
	});

	// Deal with Cors and 404 for everything else
	router.all('*', (request) => {
		if (request.method === 'OPTIONS') {
			return new Response('OK', {
				headers: corsHeaders,
			});
		} else {
			return new Response('Not Found.', { status: 404 });
		}
	});

	return router;
}

function addTodo(todo) {
	return Create(Collection('todos'), {
		data: {
			todo,
			isDone: false,
		},
	});
}

function getAllTodos() {
	return Map(Paginate(Documents(Collection('todos'))), (ref) => {
		return {
			id: Select(['ref', 'id'], Get(ref)),
			todo: Select(['data', 'todo'], Get(ref)),
			isDone: Select(['data', 'isDone'], Get(ref)),
		};
	});
}
