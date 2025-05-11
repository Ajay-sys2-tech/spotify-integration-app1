const express = require('express');
const querystring = require('querystring');
const router = express.Router();
require('dotenv').config();

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  }

router.get('/login', function(req, res) {

  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email user-follow-read';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

router.get('/callback', async function(req, res) {

    var code = req.query.code || null;
    var state = req.query.state || null;
  
    if (state === null) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
    //   var authOptions = {
    //     url: 'https://accounts.spotify.com/api/token',
    //     form: {
    //       code: code,
    //       redirect_uri: redirect_uri,
    //       grant_type: 'authorization_code'
    //     },
    //     headers: {
    //       'content-type': 'application/x-www-form-urlencoded',
    //       'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    //     },
    //     json: true
    //   };

    //   const token = await fetch(authOptions);
    //   console.log(token.json());
    //   res.status(200).json(token.json());

    const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const body = new URLSearchParams({
    code: code,
    redirect_uri: redirect_uri,
    grant_type: 'authorization_code'
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.statusText}`);
    }

    const data = await response.json();

    res.status(200).json(data); // Send the token response as JSON

  } catch (error) {
    console.error('Token fetch error:', error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
    }
  });

  module.exports = router;