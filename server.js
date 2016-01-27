var speakeasy = require('speakeasy')
var qr = require('qr-image');
var express = require('express');
var app = express();

app.set('views', './views')
app.set('view engine', 'jade')

app.get('/', function (req, res) {
  var locals = {}

  // Generate a secret
  locals.secret = speakeasy.generateSecret({length: 20})

  // Get QR code URL
  locals.qrPath = '/qrcode?qrurl=' + encodeURIComponent(locals.secret.otpauth_url);

  // Get initial token
  locals.token = getToken(locals.secret.base32)

  res.render('index', locals)
});

app.get('/token', function (req, res) {
  res.send(getToken(req.query.secret));
});

app.get('/verify', function (req, res) {
  if (verifyToken(req.query.secret, req.query.token)) {
    res.send('Verified');
  } else {
    res.send('Failed to verify');
  }
});

app.get('/qrcode', function(req, res) {
  var code = qr.image(req.query.qrurl, { type: 'png' });
  res.type('png');
  code.pipe(res);
});

function getToken(secret) {
  return speakeasy.time({secret: secret, encoding: 'base32'})
}

function verifyToken(secret, token) {
  return speakeasy.time.verify({secret: secret, encoding: 'base32', token: token})
}

var port = process.env.OPENSHIFT_NODEJS_PORT || 8081
    , ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
app.listen(port, ip);
