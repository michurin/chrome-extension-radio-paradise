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
  debug="$(echo "$h" | sed 's-.*//-tmp_debug_-;s-:.*--;s-$-.html-')"
  wget -qO"$debug" "$h"
  export RP_HOST="$h"
  perl actual-streams.pl "$debug" >>"$collection"
done
