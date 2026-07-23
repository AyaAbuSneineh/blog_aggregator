import { setUser, readConfig } from "./config.js";
import {CommandsRegistry,registerCommand,runCommand,handlerLogin} from "./commands.js";

function main() {
  const registry: CommandsRegistry = [];

  registerCommand(registry, "login", handlerLogin);

  const args = process.argv.slice(2); // the 2 elements for node and the script name 

  if(args.length < 1){
    console.error("No command provided");
    process.exit(1);
  }
  const [cmdName, ...cmdArgs] = args; // array destructuring)

  try {
    runCommand(registry,cmdName,...cmdArgs);
  } catch(error){
      console.error((error as Error).message);
    process.exit(1);
  }

  //setUser("Aya");
  //const cfg = readConfig();
  //console.log(cfg);

}

main();

