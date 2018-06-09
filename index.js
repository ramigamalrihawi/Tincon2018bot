'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'Hodor') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i]
	    let sender = event.sender.id
	    var phrases = [
	      "",
	      "",
	      "",
	      ""
	    ]
	    if (event.message && event.message.text) {
		    let text = event.message.text
		    switch(true) {
		    case (text.includes("hi")):
		      sendTextMessage(sender, "Was geht?")
		      break;
		    case (text.includes("hey")):
			  sendTextMessage(sender, "Na?")
		      break;
		    case (text.includes("angry")):
			  sendTextMessage(sender, "Ich bin sehhhr fuchsteufelswild!!!")
		      break;
		    case (text.includes("tincon")):
			  sendTextMessage(sender, "lieb das :D")
		      break; 
		    default:
			  sendTextMessage(sender, phrases[Math.floor(Math.random() * phrases.length)])
			}
	    }
    }
    res.sendStatus(200)
})

const token = "EAAcJvhNHsZAIBAPjmZAr84rK4a5PkAqZAvKRsuM2eBamxL9TtW3xAx6usxYhdkcTpWptgRVpuiKoMlXwCb4Cxnha326vvaa0w6zMqxcTGQNlPGKMIRFih2ZBN1RM1djGa5WqxrnWWVhZAF1PcrIgKB1UReEyhEyz4Lc2dHFJWEzzlTz5TeD9J"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})