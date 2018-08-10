# heart-rate-validating-admission-webhook

An admission controller is a piece of code that intercepts requests to the Kubernetes API prior to persistence of the object, but after the request is authenticated and authorized.

An example, and what inspired this repository is: https://github.com/kelseyhightower/denyenv-validating-admission-webhook

## What does it do?

Captures your heart-rate in Node.js using Bluetooth Low Energy (LE) and then permits / denies access to kubernetes if it goes too high.

## Why?

Why not!

## License

MPL-2.0
