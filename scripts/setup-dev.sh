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

echo "Installing mkcert into GOPATH=$GOPATH"
go get -u github.com/FiloSottile/mkcert

echo "Installing development certificates into system root (sudo) and $DIR"
mkcert -install kubernetes.yld.io localhost 127.0.0.1 ::1
mv kubernetes.yld.io+3-key.pem kubernetes.yld.io+3.pem "$DIR"/../cert/.
