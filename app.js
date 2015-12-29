const speakeasy = require('speakeasy')
const koa = require('koa')
const router = require('koa-router')();
const app = koa()

const Jade = require('koa-jade')
const jade = new Jade({
  viewPath: './views',
  debug: false,
  pretty: false,
  compileDebug: false
})

app.use(jade.middleware)

router.get('/', function *(next) {
  var locals = {}

  // Generate a secret
  locals.secret = speakeasy.generate_key({length: 20})

  // Get QR code URL
  locals.qrURL = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=" + encodeURIComponent('otpauth://totp/SecretKey?secret=' + encodeURIComponent(locals.secret.base32))

  // Get initial token
  locals.token = getToken(locals.secret.base32)

  this.render('index', locals, true)
});

router.get('/token', function *(next) {
  this.body = getToken(this.request.query.secret);
});

app
  .use(router.routes())
  .use(router.allowedMethods());

function getToken(secret) {
  return speakeasy.time({key: secret, encoding: 'base32'})
}

app.listen(3000);
