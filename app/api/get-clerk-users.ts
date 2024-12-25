import { getClerkUsers } from '@/lib/actions/user.actions';

export async function POST(req: Request) {
  const { userIds } = await req.json();
  const users = await getClerkUsers({ userIds });
  return Response.json(users);
}
