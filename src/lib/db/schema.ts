import { pgTable ,uuid , timestamp , text ,unique } from "drizzle-orm/pg-core";

export const users = pgTable ("users", {
    id : uuid("id").primaryKey().defaultRandom().notNull() ,
    creatAt : timestamp("created_at").defaultNow().notNull() ,
    updatedAt : timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()) ,
    name : text("name").unique().notNull() ,
});

export const feeds = pgTable("feeds",{
    id : uuid("id").primaryKey().defaultRandom() ,
    createdAt : timestamp("created_at").notNull().defaultNow() ,
    updateAt : timestamp("update_at").defaultNow().notNull().$onUpdate(()=> new Date()) ,
    name : text("name").notNull() ,
    url : text("url").notNull().unique() ,
    userId : uuid("user_id").notNull().references(() => users.id , {onDelete : "cascade" ,}) ,
}) ;

export type User = typeof users.$inferSelect;
export type Feed = typeof feeds.$inferSelect;

export const feedFollows  = pgTable("feed_follows" , {
    id : uuid("id").primaryKey().notNull().defaultRandom() ,
    createdAt : timestamp("created_at").notNull().defaultNow() ,
    updateAt : timestamp("update_at").defaultNow().notNull().$onUpdate(()=> new Date()) ,
    userId : uuid("user_id").notNull().references(() => users.id , {onDelete : "cascade" ,}) ,
    feedId : uuid("feed_id").notNull().references(() => feeds.id , {onDelete : "cascade" ,}) ,
    } , (table) => ({ userFeedUnique: unique().on(table.userId, table.feedId),}) 
) ;
export type FeedFollow = typeof feedFollows.$inferSelect;