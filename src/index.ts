import { setUser, readConfig } from "./config.js";
import {CommandsRegistry,registerCommand,runCommand,handlerLogin, handlerRegister} from "./commands.js";

async function main() {
  const registry: CommandsRegistry = [];

  const args = process.argv.slice(2); // the 2 elements for node and the script name 

  if(args.length < 1){
    console.error("No command provided");
    process.exit(1);
  }
  const [cmdName, ...cmdArgs] = args; // array destructuring)
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register",handlerRegister);

  try {
    await runCommand(registry,cmdName,...cmdArgs);
    process.exit(0);
  } catch(error){
      console.error(error);
    process.exit(1);
  }



  //setUser("Aya");
  //const cfg = readConfig();
  //console.log(cfg);

}

main();

