# titsrp-rpc-client
Discord Rich Presence support for TitsRP. If you want to use this for some crazy reason you need to add your own applicationID as an environment variable.
Running the executable will create a local http server listening on port 6918. Send a [POST](https://wiki.facepunch.com/gmod/http.Post) request (status,username,location [server name],ip [of server]) on the client to update their status. **This requires -allowlocalhttp be set in the command line if you want to make POST requests to a private network**. 

If you decide to use this on your server, you need to create your own application ID and add assets via your DDevs portal.


![omg!!](https://cdn.discordapp.com/attachments/542110797766066196/1110805431703588934/sa.jpg)
