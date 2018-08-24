# heart-rate-validating-admission-webhook

An admission controller is a piece of code that intercepts requests to the Kubernetes API prior to persistence of the object, but after the request is authenticated and authorized.

An example, and what inspired this repository is: https://github.com/kelseyhightower/denyenv-validating-admission-webhook

## What does it do?

Captures your heart-rate in Node.js using Bluetooth Low Energy (LE) and then permits / denies access to kubernetes if it goes too high.

## Why?

Why not!

## Deployment

```
mkcert -install kubernetes.yld.io localhost 127.0.0.1 ::1
mv kubernetes.yld.io+3-key.pem kubernetes.yld.io+3.pem cert/.

# Change clientConfig.caBundle to below:
cat $(mkcert -CAROOT)/rootCA.pem | openssl enc -base64 -A

kubectl apply -f deployment
```

## License

MPL-2.0
