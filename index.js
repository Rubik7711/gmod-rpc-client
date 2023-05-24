require('dotenv').config()

//discordrpc
const DiscordRPC = require('discord-rpc')
const clientId = process.env.CLIENT_ID
const API = process.env.API
const rpc = new DiscordRPC.Client({ transport: 'ipc' })
DiscordRPC.register(clientId)

//steamclient
var gsu = require('get-steam-user');

//cache
const NodeCache = require("node-cache");
const cachedStatus = new NodeCache();
cachedStatus.set("status", '');


rpc.on('ready', () => {
  setActivity()
  setInterval(() => { setActivity() }, 15e3);
});

async function setActivity() {
  if (!rpc) return

  //TODO: Get game state & make sure they're on tits 
  gsu.getSteamId(function (steamid) {
    if (!steamid) return
    fetch(`${API}/${steamid}`)
      .then((r) => r.json())
      .then((data) => {
        if (cachedStatus.get("status") == data[0].status) return
        const startTimestamp = new Date()
        if (data[0].status.includes('/*')) {
          var escDetails = data[0].status.split('/*').pop().split('*/')[0];
          //TODO: Strip non-ascii characters
          var escState = data[0].status.split('*/').pop()
        }
        rpc.setActivity({
          details: (escDetails) && `${escDetails} 🔊` || data[0].nick,
          state: (escState) && `${escState}` || `${data[0].status} at ${data[0].location}`,
          startTimestamp,
          //TODO: Display unique image based on grid location
          largeImageKey: 'pier',
          largeImageText: `This is a WIP and completely useless lol`,
          smallImageKey: 'slump',
          smallImageText: '148.59.74.119:27015',
          instance: false,
        });
        cachedStatus.set("status", data[0].status)
        console.log('updated status:', data[0].status)
      })
      .catch(function (err) {
        console.log("Unable to fetch:", err);
      });
  });
}

rpc.login({ clientId }).catch(console.error);
