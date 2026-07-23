import { setUser} from "./config.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => void; // function type
export type CommandEntry = [cmdName: string, handler: CommandHandler]; // tuple type
export type CommandsRegistry =CommandEntry[];    // array of tuples

// we use this function to verify username is provided and set the user
export function handlerLogin(cmdName: string, ...args: string[]): void {
  if (args.length < 1) {
    throw new Error("username is required");
  }
  setUser(args[0]); // set the user in config
  console.log(`User set to ${args[0]}`);
}
export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void { // Register a command handler
  registry.push([cmdName, handler]);
}
export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): void { // Run a command handler
  const handler = registry.find(([name]) => name === cmdName)?.[1];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  handler(cmdName, ...args);
}