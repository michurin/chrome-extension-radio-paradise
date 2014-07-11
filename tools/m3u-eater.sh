#!/bin/sh

# step 2. download all *.m3u and extract streams

collection='collection.tmp'
m3u_tmp='/tmp/m3u_tmp'
list_of_streams='streams.txt'

export GREP_OPTIONS=''

cat "$collection" |
egrep '^(application/ogg|audio/mpeg) ' |
grep -v 'kfat-' |
while read line
do
  wget -qO- "${line##* }" > "$m3u_tmp"
  one=`wc -l "$m3u_tmp" | cut -f1 -d ' '`
  if [ "x$one" = 'x1' ]
  then
    echo "$line `sed 's/\x0D$//' "$m3u_tmp"`"
  else
    echo 'INVALID FILE!'
    echo "# $line"
    cat "$m3u_tmp"
  fi
  rm "$m3u_tmp"
done > "$list_of_streams"
