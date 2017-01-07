#!/bin/sh

# step 2. download all *.m3u and extract streams

collection='collection.tmp'
m3u_tmp='/tmp/m3u_tmp'
list_of_streams='streams.txt'

export GREP_OPTIONS=''
export LC_ALL=C

cat "$collection" |
while read line
do
  if echo "$line" | egrep '^(application/ogg|audio/mpeg|audio/aacp) .*\.radioparadise\.com.*/(ogg|mp3|aac)-' >/dev/null
  then
    echo "Proc '$line'" >&2
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
  else
    echo "\033[1;31mDrop\033[0m '$line'" >&2
  fi
done |
sort > "$list_of_streams"
