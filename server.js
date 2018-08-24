const restify = require('restify');
const errors = require('restify-errors');
const heart = require('./');
const fs = require('fs');

let heartData = {};
heart.on('data', data => heartData = data);

const server = restify.createServer({
  name: 'heart-rate-validating-admission-webhook',
  version: '1.0.0',
  certificate: fs.readFileSync('./cert/kubernetes.yld.io+3.pem'),
  key: fs.readFileSync('./cert/kubernetes.yld.io+3-key.pem')
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.post('/', function (req, res, next) {
  const admissionRequest = req.body;

  if (!admissionRequest || !admissionRequest.request || !admissionRequest.request.object) {
    return next(new errors.BadRequestError('Request has no body'));
  }

  const object = admissionRequest.request.object;
  console.log(object);

  let admissionResponse = {
    allowed: false
  };

  let bpmThreshold = 80;
  let bpmTooHigh = heartData.bpm > bpmThreshold

  if (!bpmTooHigh) {
    admissionResponse.allowed = true;
  } else {
    admissionResponse.status = {
      status: 'Failure',
      message: `heart rate: ${heartData.bpm} is too high (Higher than ${bpmThreshold})`,
      reason: `heart rate: ${heartData.bpm} is too high (Higher than ${bpmThreshold})`,
      code: 402
    };
  }

  let admissionReview = {
    response: admissionResponse
  };

  console.log('Request got:', heartData, 'allowed: ', admissionResponse.allowed);
  res.setHeader('Content-Type', 'application/json');
  res.send(admissionReview);
  res.status(200);
  return next();
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
