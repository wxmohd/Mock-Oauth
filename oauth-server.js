const {OAuth2Server} = require('oauth2-mock-server');
const server = new OAuth2Server();
async function start(){
    await server.issuer.keys.generate('RS256'); //new RSA key 
    await server.start(8080, 'localhost');
    console.log('OAuth2 Server running at http:/localhost:8080');
    console.log('Endpoints:');
    console.log('- Authorization: http://localhost:8080/authorize');
    console.log('- Token: http://localhost:8080/token');
    console.log('- UserInfo: http://localhost:8080/userinfo');
    console.log('- JWKS: http://localhost:8080/.well-known/jwks.json');
}
start().catch(console.error);