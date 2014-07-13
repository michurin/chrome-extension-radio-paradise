#!/bin/sh

# step 1. collect a list of *.m3u files

collection='collection.tmp'

echo -n >"$collection"

for h in \
  http://stream-dc1.radioparadise.com \
  http://stream-ru1.radioparadise.com:9000 \
  http://stream-tx1.radioparadise.com \
  http://stream-tx3.radioparadise.com \
  http://stream-uk1.radioparadise.com
do
  echo $h
  export RP_HOST="$h"
  wget -qO- "$h" | perl actual-streams.pl >>"$collection"
done
