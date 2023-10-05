import { Router, RouterType } from 'itty-router';
import faunadb, { Collection, Documents, Get, Paginate, Ref, Query, Map, Index, Select } from 'faunadb';

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
		const dbQuery = await faunaClient.query(
			Map(Paginate(Documents(Collection('todos'))), (ref) => {
				return {
					id: Select(['ref', 'id'], Get(ref)),
					todo: Select(['data', 'todo'], Get(ref)),
					isDone: Select(['data', 'isDone'], Get(ref)),
				};
			})
		);
		return new Response(JSON.stringify(dbQuery), {
			headers: {
				'Content-type': 'application/json',
				...corsHeaders,
			},
		});
	});

	// 404 for everything else
	router.all('*', () => new Response('Not Found.', { status: 404 }));

	return router;
}
