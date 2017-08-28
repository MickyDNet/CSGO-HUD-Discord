# CSGO HUD GameState Integration - Discord Version

The original script was created by Double0negative. All I did was turn it into a Discord Bot.
The web page is still there, because its awesome!

# Install 

* If you have GIT, you can use `git clone https://github.com/MickyDNet/CSGO-HUD-Discord.git` to download the project. Otherwise, Click the Download Zip button above
* Install Node.JS (NPM is included)
* Create a file named `gamestate_integration_hud.cfg` in your csgo cfg folder (`steamapps/common/Counter-Strike Global Offensive/csgo/cfg/`) copy-paste from https://gist.github.com/Double0negative/dd24fae86c48d277de0a
* open CMD, type: cd \where\you\extracted\the\zip\CSGO-HUD-master
* in CMD: `npm install`
* in CMD: `node server.js`
* You should then be able to connect in a web browser by going to `http://localhost:30120`. Start up your game and connect to a match and data should begin streaming
* Linux and Mac setup is basically identical, just switch out CMD for Terminal

# Install - Discord Part
* Create a Discord Bot at https://discordapp.com/developers/applications/me and copy the bot token into server.js`
* Inside of server.js, do a find and replace on 'csgospam' with your channel name in discord.



