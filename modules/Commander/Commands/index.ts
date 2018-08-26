import { readdirSync as listDirectory, statSync as stat } from "fs";

import { Commander, Command } from "@";


export const Commands: (new (commander: Commander) => Command)[] = [];
for (const item of listDirectory("modules/Commander/Commands"))
    if (stat("modules/Commander/Commands/" + item).isDirectory())
        for (const command of listDirectory("modules/Commander/Commands/" + item))
            if (command.endsWith(".ts"))
                Commands.push(require(`./${item}/${command.slice(0, -3)}`).default);