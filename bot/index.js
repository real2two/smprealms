let { ShardingManager } = require('discord.js');
let manager = new ShardingManager('./bot.js', { token: "TOKEN HERE" });

manager.on('shardCreate', shard => console.log(`[Shard ${shard.id}] Shard is ready.`));
manager.spawn();
