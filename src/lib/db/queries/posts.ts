import { db } from "..";
import { posts ,feedFollows, feeds, users} from "../schema";
import { eq, desc } from "drizzle-orm";

export async function createPost(title: string,url: string,description: string | null,
  publishedAt: Date | null,feedId: string) {

  const [post] = await db.insert(posts)
    .values({title,url,description,publishedAt,feedId,})
    .onConflictDoNothing({target: posts.url,})
    .returning();
  return post;
}
export async function getPostsForUser(userId: string,limit: number) {
  const result = await db
    .select({id: posts.id,title: posts.title,url: posts.url,
      description: posts.description,publishedAt: posts.publishedAt,feedName: feeds.name,})
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return result;
}