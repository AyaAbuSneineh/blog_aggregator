import { db } from "..";
import { feeds, users} from "../schema";
import {eq,sql, asc} from "drizzle-orm"

export async function createFeed(name: string, url: string, userId: string){
    const [result] = await db.insert(feeds).values({ name : name, url:url, userId:userId }).returning();
    return result ;
}

export async function allFeeds () {
    const result = await db.select({id : feeds.id , name : feeds.name , 
        url : feeds.url , userName : users.name})
        .from(feeds).innerJoin(users,eq(users.id,feeds.userId)) ;
    return result
}

export async function getFeedByUrl(url : string) {
    const result = await db.select().from(feeds).where(eq(feeds.url,url))
    return result ;
}

export async function markFeedFetched(feedId: string) {
  await db.update(feeds)
    .set({
        lastFetchedAt: new Date(),
        updatedAt: new Date(),
    })
    .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
  const [feed] = await db.select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
    .limit(1);
  return feed;
}