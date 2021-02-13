let { ShardingManager } = require('discord.js');
let manager = new ShardingManager('./bot.js', { token: "ODA3Mjc0MzMxMDEyMzMzNjM5.YB1mzg.Z8riqrf23TNJT0tbWICnbDmAkPs" });

manager.on('shardCreate', shard => console.log(`[Shard ${shard.id}] Shard is ready.`));
manager.spawn();