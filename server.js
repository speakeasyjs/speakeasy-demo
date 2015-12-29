var speakeasy = require('speakeasy')
var qr = require('qr-image');
var express = require('express');
var app = express();

app.set('views', './views')
app.set('view engine', 'jade')

app.get('/', function (req, res) {
  var locals = {}

  // Generate a secret
  locals.secret = speakeasy.generate_key({length: 20})

  // Get QR code URL
  locals.qrURL = 'otpauth://totp/SecretKey?secret=' + encodeURIComponent(locals.secret.base32);
  locals.qrPath = '/qrcode?qrurl=' + encodeURIComponent(locals.qrURL);

  // Get initial token
  locals.token = getToken(locals.secret.base32)

  res.render('index', locals)
});

app.get('/token', function (req, res) {
  res.send(getToken(req.query.secret));
});

app.get('/qrcode', function(req, res) {
  var code = qr.image(req.query.qrurl, { type: 'png' });
  res.type('png');
  code.pipe(res);
});

function getToken(secret) {
  return speakeasy.time({key: secret, encoding: 'base32'})
}

var port = process.env.OPENSHIFT_NODEJS_PORT || 8081
    , ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
app.listen(port, ip);
