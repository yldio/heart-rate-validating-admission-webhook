#! /usr/bin/bash

#
# Prelude - make bash behave sanely
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
#
set -euo pipefail
IFS=$'\n\t'
# Beware of CDPATH gotchas causing cd not to work correctly when a user has
# set this in their environment
# https://bosker.wordpress.com/2012/02/12/bash-scripters-beware-of-the-cdpath/
unset CDPATH

# Current directory of this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

KUBE_FILE=$(cat < "$DIR/../deployment/validating-webhook-configuration.yaml")
CERTIFICATE=$(cat < "$(mkcert -CAROOT)/rootCA.pem" | openssl enc -base64 -A)

echo "${KUBE_FILE/\%\%CERTIFICATE\%\%/$CERTIFICATE}" | kubectl apply -f -
