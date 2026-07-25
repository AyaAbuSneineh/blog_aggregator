import { setUser} from "./config.js";
import { createUser, getUserByName } from "./lib/db/queries/users.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>; // function type
export type CommandEntry = [cmdName: string, handler: CommandHandler]; // tuple type
export type CommandsRegistry =CommandEntry[];    // array of tuples

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