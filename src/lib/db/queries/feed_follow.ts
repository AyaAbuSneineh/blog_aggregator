import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { eq , and} from "drizzle-orm";

export async function createFeedFollow(userId: string,feedId: string) {
    const [newFeedFollow] = await db.insert(feedFollows).values({userId , feedId}).returning();
    const [result] = await db.select({id: feedFollows.id,
    createdAt: feedFollows.createdAt,
    updatedAt: feedFollows.updatedAt,
    userName: users.name,
    feedName: feeds.name,})
    .from(feedFollows)
    .innerJoin(users,eq(users.id,feedFollows.userId))
    .innerJoin(feeds,eq(feedFollows.feedId,feeds.id))
    .where(eq(feedFollows.id,newFeedFollow.id));
    return result ;
}

export async function getFeedFollowsForUser(userId: string) {
    const result = await db.select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userName: users.name,
      feedName: feeds.name,
      feedUrl: feeds.url,
    })
    .from(feedFollows)
    .innerJoin(users,eq(users.id,feedFollows.userId))
    .innerJoin(feeds,eq(feeds.id,feedFollows.feedId))
    .where(eq(feedFollows.userId,userId)) ;
    return result ;
}

/*export async function deleteFeedFollowByUserAndUrl(userId : string,url:string){
    const follow = await db.select({id : feedFollows.id}) 
    .from(feedFollows)
    .innerJoin(users,eq(feedFollows.userId,userId))
    .where(and(eq(feedFollows.userId,userId),eq(feeds.url,url))) ;
    if (follow.length === 0) {
        throw new Error("Feed follow not found");
    }
    await db.delete(feedFollows)
    .where(eq(feedFollows.id,follow[0].id)) ;

}*/
export async function deleteFeedFollowByUserAndUrl(userId: string,url: string) {
  const follow = await db.select({id: feedFollows.id,})
    .from(feedFollows)
    .innerJoin(feeds,eq(feedFollows.feedId, feeds.id))
    .where(and(eq(feedFollows.userId, userId),eq(feeds.url, url)));

  if (follow.length === 0) {
    throw new Error("Feed follow not found");
  }
  await db.delete(feedFollows)
    .where(eq(feedFollows.id, follow[0].id));
}