import { setUser} from "./config.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry =Record<string, CommandHandler>; 

export function handlerLogin(cmdName: string, ...args: string[]): void {
  if (args.length<1) {
    throw new Error("username is required");
  }
  setUser(args[0]);
  console.log(`User set to ${args[0]}`);
}
export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void { // Register a command handler
  registry[cmdName] = handler;
}
export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): void { // Run a command handler
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  handler(cmdName, ...args);
}