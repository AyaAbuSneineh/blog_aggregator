import { pgTable ,uuid , timestamp , text } from "drizzle-orm/pg-core";

export const users = pgTable ("users", {
    id : uuid("id").primaryKey().defaultRandom().notNull() ,
    creatAt : timestamp("created_at").defaultNow().notNull() ,
    updatedAt : timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()) ,
    name : text("name").unique().notNull() ,
});