export const guildIDs: string[] =
    JSON.parse(process.env.DOPPELGANGSTER_GUILD_IDS as string) as string[];

export let autoAttachToAllGuilds: boolean = true;

export let underAttack: boolean = true;
