var speakeasy = require('speakeasy')
var express = require('express');
var app = express();

app.set('views', './views')
app.set('view engine', 'jade')

app.get('/', function (req, res) {
  var locals = {}

  // Generate a secret
  locals.secret = speakeasy.generate_key({length: 20})

  // Get QR code URL
  locals.qrURL = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=" + encodeURIComponent('otpauth://totp/SecretKey?secret=' + encodeURIComponent(locals.secret.base32))

  // Get initial token
  locals.token = getToken(locals.secret.base32)

  res.render('index', locals)
});

app.get('/token', function (req, res) {
  res.send(getToken(req.query.secret));
});

function getToken(secret) {
  return speakeasy.time({key: secret, encoding: 'base32'})
}

app.listen(8080);
