import { getDocumentUsers } from '@/lib/actions/user.actions';

export async function POST(req: Request) {
  const { roomId, currentUser, text } = await req.json();
  const users = await getDocumentUsers({ roomId, currentUser, text });
  return Response.json(users);
}
