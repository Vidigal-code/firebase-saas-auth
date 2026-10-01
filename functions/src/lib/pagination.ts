import type { Query, QueryDocumentSnapshot } from 'firebase-admin/firestore';

export type PageHandler = (docs: QueryDocumentSnapshot[]) => Promise<number>;

export interface PageRequest {
  query: Query;
  pageSize: number;
  handlePage: PageHandler;
}

const fetchPage = (query: Query, pageSize: number, cursor?: QueryDocumentSnapshot) =>
  (cursor ? query.startAfter(cursor) : query).limit(pageSize).get();

export const forEachPage = async (request: PageRequest, cursor?: QueryDocumentSnapshot): Promise<number> => {
  const { docs } = await fetchPage(request.query, request.pageSize, cursor);
  if (docs.length === 0) return 0;

  const processed = await request.handlePage(docs);
  const isLastPage = docs.length < request.pageSize;
  if (isLastPage) return processed;

  return processed + (await forEachPage(request, docs.at(-1)));
};
