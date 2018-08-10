const restify = require('restify');
const errors = require('restify-errors');

const server = restify.createServer({
  name: 'heart-rate-validating-admission-webhook',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.post('/', function (req, res, next) {
  const admissionRequest = req.body;

  if (!admissionRequest) {
    return next(new errors.BadRequestError('Request has no body'));
  }

  const object = admissionRequest.request.object;

  let admissionResponse = {
    allowed: true
  };

  let bpm = 0;
  let bpmThreshold = 80;

  if (!bpmTooHigh) {
    admissionResponse.allowed = true;
  }

  let admissionReview = {
    response: admissionResponse
  };

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(admissionReview));
  res.status(200).end();
  return next();
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
