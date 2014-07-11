#!/bin/sh

list_of_streams='streams.txt'

cut -f3 -d ' ' "$list_of_streams" | perl -pe '
  $p = m|ogg| ? q|ogg| : q|mp3|;
  m|(\d+)m?$|;
  $p .= qq| $1k|;
  if (m|\Q-uk1|) {
    $p .= q| (uk)|;
  } elsif (m|\Q-dc1|) {
    $p .= q| (us)|;
  } elsif (m|\Q-ru1|) {
    $p .= q| (ru)|;
  }
  s|^|$p\t|;
'
