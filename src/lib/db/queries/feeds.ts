import { db } from "..";
import { feeds, users} from "../schema";
import {eq} from "drizzle-orm"

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