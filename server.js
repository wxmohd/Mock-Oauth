const express = require('express');
const app = express();
const fetch = require ('node-fetch');
const path = require ('path');
const PORT = 3000;

const config={
    clientID: 'my-client',
    clientSecret: 'my-secret',
    authEndpoint: 'http://localhost:8080/authorize',
    tokenEndpoint: 'http://localhost:8080/token',
    userInfoEndpoint: 'http://localhost:8080/userinfo',
    redirectURI: 'http://localhost:3000/callback'
};

app.use(express.static(path.join(__dirname, 'public')));
app.get('/login', (req, res)  => {
     const authURL = `${config.authEndpoint}?` +
     `client_id=${config.clientID}&` +
     `redirect_uri=${encodeURIComponent (config.redirectURI)}&` +
     `response_type=code&` +
     `scope=openid profile email`;
  res.redirect(authURL);
});

app.get ('/callback', async (req, res) => {
    const {code}= req.query;
    if (!code) {
        return res.status(400).send('No authorization code recieved');
    }
    try {
        const tokenResponse = await fetch(config.tokenEndpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_URI: config.redirectURI,
                client_id: config.clientID,
                client_secret: config.clientSecret,
            })
        });

        const tokenData= await tokenResponse.json();
        const userResponse = await fetch(config.userInfoEndpoint, {
                headers: {'Authorization': `Bearer ${tokenData.access_token}` }
        });
           const userData= await userResponse.json();
           
           res.send(`
            <h1> Login Successful!</h1>
            <h2> Access Token:</h2>
            <pre> ${tokenData.access_token}</pre>
            <h2> User Info </h2>
            <pre> ${JSON.stringify(userData, null, 2)}</pre>
            <a href="/">Back to Home</a>
           `);
    } catch (error) {
        res.status(500).send('Error: '+error.message);
    }
        });
        app.listen(PORT, () => {
            console.log(`App running at http://localhost:${PORT}`);
        });
    