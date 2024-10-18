#!/bin/sh
if [ "$1" != 'alert' ]; then
   echo "sorry, '$1' is not a command"
   exit 1
fi
if [ "$2" == '' ]; then
   echo "sorry, '$1' command need params. e.g. ExRateCheck"
   exit 1
fi
exec node $1 $2
