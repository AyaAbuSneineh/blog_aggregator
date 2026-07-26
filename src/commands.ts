import { setUser , readConfig} from "./config.js";
import { allFeeds, createFeed , getFeedByUrl} from "./lib/db/queries/feeds.js";
import { createUser, getUserByName ,deleteAllUsers , getUsers} from "./lib/db/queries/users.js";
import { fetchFeed } from "./lib/rss/fetchFeed.js";
import type {Feed , User} from "./lib/db/schema.js"
import {createFeedFollow , getFeedFollowsForUser ,deleteFeedFollowByUserAndUrl } from "./lib/db/queries/feed_follow.js";


export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>; // function type
export type CommandEntry = [cmdName: string, handler: CommandHandler]; // tuple type
export type CommandsRegistry =CommandEntry[];    // array of tuples

export type UserCommandHandler = (cmdName: string,user: User,...args: string[]) => Promise<void>;

// we use this function to verify username is provided and set the user
export async function handlerLogin(cmdName: string, ...args: string[]){
  if (args.length != 1) {
    throw new Error(`usage: ${cmdName} <name>`);;
  }
  
  const userName = args[0];

  const user = await getUserByName(userName);
  if (!user) {
    throw new Error(`User ${userName} not found`);
  }

  setUser(user.name);
  console.log("User switched successfully!");
}
export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): Promise<void> { // Register a command handler
  registry.push([cmdName, handler]);
}
export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> { // Run a command handler
  const handler = registry.find(([name]) => name === cmdName)?.[1];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  await handler(cmdName, ...args);
}


export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length != 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const userName = args[0];

  const existingUser = await getUserByName(userName);
  if (existingUser) { // Check if the user already exists
      throw new Error(`User ${userName} already exists`);
  }

  const user = await createUser(userName);
  if (!user) {
    throw new Error(`User ${userName} not found`);
  }

  setUser(user.name);
  console.log("User created successfully!");
}

export async function handlerReset(cmdName: string, ...args: string[]) {
  if (args.length != 0) {
    throw new Error(`usage: ${cmdName}`);
  }
  await deleteAllUsers();
  console.log("All users deleted successfully!");
}

export async function handlerAllUsers(cmdName: string, ...args: string[]) {
  if (args.length != 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  const users = await getUsers()
  if (users.length === 0) {
    console.log("No users found.");
  }
  const currentUser = readConfig().currentUserName
  for (const user of users) {
    if (user.name === currentUser){
      console.log(`* ${user.name} (current)`);
    }
    else {
      console.log(`* ${user.name}`);
    }
  }
}

export async function handlerAgg(cmdName : string , ...args:string[]) {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml") ;
  console.log(feed);
}
export async function handlerAddFeed (cmdName : string , user:User,...args:string[]){
  if (args.length != 2) {
    throw new Error (`usage: ${cmdName} <name> <url>`)
  }
  const [name , url] = args ;
  const feed = await createFeed(name, url, user.id)
  const follow = await createFeedFollow(user.id,feed.id);


  console.log(`${follow.userName} is following ${follow.feedName}`);

  printFeed(feed, user);
}

export function printFeed(feed : Feed , user : User) {
  console.log(`Feed : Name  = ${feed.name} , url = ${feed.url} , user = ${user.name}`);
}

export async function handlerFeeds(cmdName : string, ...args : string[]){
  if (args.length != 0) {
    throw new Error (`usage: ${cmdName}`)
  }
  const feeds = await allFeeds() ;
  if (feeds.length === 0) {
    console.log(`No feeds found`)
  }
  for (const feed of feeds ) {
    console.log(`* ${feed.name}`);
    console.log(`  URL: ${feed.url}`);
    console.log(`  User: ${feed.userName}`);
  }
  
}

export async function handlerFollow(cmdName : string, user:User,...args : string[]){

  if (args.length != 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }
  const url = args[0]
  const feeds  =  await getFeedByUrl(url)
  
  if (feeds.length === 0) {
    throw new Error("Feed not found");
  }
  const feed = feeds[0] ;
  const follow = await createFeedFollow(user.id, feed.id);
  console.log(`${follow.userName} is following ${follow.feedName}`)
  
}

export async function handlerFollowing(cmdName : string, user:User,...args : string[]) {
  if (args.length != 0) {
    throw new Error (`usage: ${cmdName}`)
  }
  const follows = await getFeedFollowsForUser(user.id)
  for (const follow of follows) {
    console.log(`* ${follow.feedName}`);
  }
  
}


export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {

  return async function(cmdName: string, ...args: string[]) {
    const config = readConfig();
    const user = await getUserByName(config.currentUserName);
    if (!user) {
      throw new Error(`User ${config.currentUserName} not found`);
    }
    await handler(cmdName, user, ...args);
  };
}

export async function handlerUnfollow(cmdName: string,user: User,...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }
  const url = args[0];
  await deleteFeedFollowByUserAndUrl(user.id,url);
  console.log("Unfollowed successfully!");
}