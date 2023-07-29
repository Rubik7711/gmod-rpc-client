
function SendStatus(s, act)
    local body = {
        username = act || LocalPlayer():Nick(),
        status = s,
        location = GetHostName(),
        ip = game.GetIPAddress()
    }
    http.Post("http://127.0.0.1:6918", body)
end

util.RPC = SendStatus


/*  example useage:

        util.RPC("🔊 Out Of Touch (C3EYOND Remix)", "Boombox")

        hook.Add("PlayerInitialSpawn", "RPC.Spawn", function(ply)
            util.RPC("Joined my epic server!!")
        end)
        
*/

