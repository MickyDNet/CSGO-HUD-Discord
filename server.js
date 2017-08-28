	const Discord = require('discord.js');
	const dclient = new Discord.Client();
	var tochannel = dclient.channels.find('name','csgospam');
	var bombMessage = 0;
	var bombTimerExists = 0;
	var scoreCounted = 0;
	let nmsg;
	
	const token = '<DISCORD BOT TOKEN>';
	
	dclient.on('ready', () => {
		dclient.user.setStatus('invisible')
		var tochannel = dclient.channels.find('name','csgospam');
			tochannel.send('Online!');
	});

	
    http = require('http');
    fs = require('fs');

    var version = "1.0.4";
    var csgoport = 3000;
    var webport = 30120; //2626

    var app = require('express')();
    var express = require('http').Server(app);
    var io = require('socket.io')(express);

    console.log()
    console.log("\tStarting CSGO Data Integration HUD "+version+" by Double0negative");
    console.log("\thttps://github.com/Double0negative/CSGO-HUD");
	console.log()
	console.log("\tStarting Discord Integration by MickyDNet");
	console.log("\thttps://github.com/MickyDNet/CSGO-HUD-Discord");

    app.set('view engine', 'jade');

    app.get('/', function(req, res) {
        res.render('index');
    });

    app.get('/main.js', function(req, res) {
        res.sendFile(__dirname +'/public/js/main.js');
    });

    app.get('/style.css', function(req, res) {
        res.sendFile(__dirname +'/public/css/style.css');
    });

    io.on('connection', function(socket) {
        
    });

    express.listen(webport, function() {
        console.log('\n\tOpen http://localhost:'+webport+' in a browser to connect to HUD');
        console.log('\n');
    });

    server = http.createServer(function(req, res) {

        if (req.method == 'POST') {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            var body = '';
            req.on('data', function(data) {
                body += data;
            });
            req.on('end', function() {
                console.log("POST payload: " + body);
                update(JSON.parse(body));
                res.end('');
            });

        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            var html = 'yes';
            res.end(html);
        }

    });

    var map;
    var player;

    var round = {
        phase: "",
        timestart: 0,
        time: 0,
        maxTime: 0,
        bomb: {
            planted: false,
            timestart: 0,
            time: 0,
            maxTime: 40
        }
    };

    function update(json) {
        if (json.round) {
            if (!(round.phase === json.round.phase)) {
                round.timestart = json.provider.timestamp;
                round.phase = json.round.phase;
				//console.log("round.phase: " + round.phase);
            }

            var maxTime = 0;
            if (json.round.phase === 'live') {
				scoreCounted = 0;
                maxTime = 115;
            } else if (round.phase === 'freezetime') {
                maxTime = 15;
				let messagecount = parseInt('4');
				if (scoreCounted === 0) {
					var tochannel = dclient.channels.find('name','csgospam');
					tochannel.fetchMessages({ limit: 5 }).then(messages => tochannel.bulkDelete(messages.filter(m => m.author.id === dclient.user.id)));
					const embed = {
					  "title": "Round over",
					  "color": 16381126,
					  "footer": {
						"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
						"text": "CS:GO Discord - By MickyDNet"
					  },
					  "thumbnail": {
						"url": "https://cdn.discordapp.com/embed/avatars/0.png"
					  },
					  "author": {
						"name": "CS:GO Discord",
						"url": "https://discordapp.com",
						"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
					  },
					  "fields": [

						{
						  "name": "CT",
						  "value": json.map.team_ct.score,
						  "inline": true
						},
						{
						  "name": "T",
						  "value": json.map.team_t.score,
						  "inline": true
						}
					  ]
					};
					tochannel.send({ embed });
					tochannel.send("Round over - CT: " + json.map.team_ct.score + " - T:" + json.map.team_t.score, {tts: true})
					tochannel.fetchMessages({ limit: 1 }).then(messages => tochannel.bulkDelete(messages.filter(m => m.author.id === dclient.user.id)));
					scoreCounted = 1;
				}
            } else {
                maxTime = 7;
            }
            round.time = maxTime - (new Date().getTime() / 1000 - round.timestart);
            round.maxTime = maxTime;

            if (!round.bomb.planted && json.round.bomb === 'planted') {
                round.bomb.planted = true;
                round.bomb.timestart = json.provider.timestamp;
            } else if (round.bomb.planted && json.round.bomb !== 'planted') {
                round.bomb.planted = false;
				bombMessage = 0;
				bombTimerExists = 0;
            }

            if (round.bomb.planted) {
                round.bomb.time = 40 - (new Date().getTime() / 1000 - round.bomb.timestart);
				if (bombMessage !== 1) {
					var tochannel = dclient.channels.find('name','csgospam');
					tochannel.send('The bomb has been planted!', {tts: true});
					bombMessage = 1;
					bombTimer = 39;
					function fctBombTimer() {
						setTimeout(function () {
							if (bombMessage !== 0) {
								var tochannel = dclient.channels.find('name','csgospam');
								if (bombTimerExists == 0) {
									//tochannel.send(bombTimer).then(nmsg => nmsg.edit(bombTimer));
									tochannel.send("Bomb Timer: ~" + bombTimer).then(msg => {
									  nmsg = msg
									  msg.edit("Bomb Timer: ~" + bombTimer
									)})
									bombTimerExists = 1;
								} else {
									nmsg.edit("Bomb Timer: ~" + bombTimer);
								}
								bombTimer = bombTimer - 1;
								fctBombTimer();
							}
						}, 1000);
					}
					fctBombTimer();
				}
			}

            json.extra = {};
            json.extra.round = round;
        }

        io.emit("update", JSON.stringify(json));
    }

    server.listen(csgoport);
	dclient.login(token);
