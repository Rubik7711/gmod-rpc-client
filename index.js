require('dotenv').config()

//client stuff
const ConsoleWindow = require("node-hide-console-window")
const Tray = require('trayicon')
const fs = require('fs')

//local server
const http = require('http')
const querystring = require('querystring')

//discordrpc
const DiscordRPC = require('discord-rpc')
const clientId = process.env.CLIENT_ID
const API = process.env.API
const rpc = new DiscordRPC.Client({ transport: 'ipc' })
DiscordRPC.register(clientId)

//cache
const NodeCache = require("node-cache");
const cachedStatus = new NodeCache();
cachedStatus.set("status", '');

rpc.on('ready', () => {
  console.log(`rpc client online`)
})
rpc.login({ clientId }).catch(console.error)

const server = http.createServer(function(request, response) {
  if (request.method == 'POST') {
    var body = ''
    request.on('data', function(data) {
      body += data
    })
    request.on('end', function() {
      const req = querystring.parse(body);
      if (cachedStatus.get("status") == req.status) return
      const startTime = new Date()
      rpc.setActivity({
        details: req.username,
        state: `${req.status}`,
        startTime,
        largeImageKey: 'gmod',
        largeImageText: req.location || "",
        smallImageKey: 'slump',
        smallImageText: req.ip || "",
        instance: false,
      });
      cachedStatus.set("status", req.status)
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.end('post received')
    })
  }
})

server.on('error', function(e) {
  if (e.code === "EADDRINUSE") {
      console.log("RPC service already running - can't run more than one instance");
      process.exit(1);
  } else {
      console.log(e);
  }
})

server.listen(6918, '127.0.0.1')
console.log(`Listening at http://127.0.0.1:6918`)

Tray.create(function(tray) {
  tray.setTitle('TitsRP Discord Presence')
  tray.setIcon(fs.readFileSync('./tit.ico'))
  let quit = tray.item("Quit", () => process.exit(0) );
  tray.setMenu(quit);
})

ConsoleWindow.hideConsole()
