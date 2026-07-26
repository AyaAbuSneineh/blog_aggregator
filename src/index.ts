import { setUser, readConfig } from "./config.js";
import {CommandsRegistry,registerCommand,runCommand,handlerLogin, 
  handlerRegister, handlerReset,handlerAllUsers, handlerAgg, 
  handlerAddFeed , handlerFeeds , handlerFollow,
  handlerFollowing,middlewareLoggedIn , 
  handlerUnfollow ,handlerBrowse} from "./commands.js";

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
  registerCommand(registry, "reset",handlerReset);
  registerCommand(registry,"users",handlerAllUsers);
  registerCommand(registry,"agg",handlerAgg);
  registerCommand(registry,"addfeed",middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry,"feeds",handlerFeeds);
  registerCommand(registry,"follow",middlewareLoggedIn(handlerFollow));
  registerCommand(registry,"following",middlewareLoggedIn(handlerFollowing));
  registerCommand(registry,"unfollow",middlewareLoggedIn(handlerUnfollow));
  registerCommand(registry,"browse",middlewareLoggedIn(handlerBrowse));

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

