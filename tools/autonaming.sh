#!/bin/sh

list_of_streams='streams.txt'

cut -f3 -d ' ' "$list_of_streams" |
perl -pe '
  $p = m|ogg| ? q|ogg| : m|mp3| ? q|mp3| : q|aac|;
  m|(\d+)m?$|;
  $p .= q| | . $1 . q|k|;
  if (m|\Q-uk1|) {
    $p .= q| (uk)|;
  } elsif (m|\Q-dc1|) {
    $p .= q| (us-dc)|;
  } elsif (m|\Q-tx3|) {
    $p .= q| (us-tx)|;
  } elsif (m|\Q-ru1|) {
    $p .= q| (ru)|;
  } else {
    warn "Can not resolv $_";
  }
  $d = $p;
  $d =~ s/[()]//g;
  $d =~ s/\s+/-/g;
  $d =~ s/-us-tx$//;  # historical reasons
  $d =~ s/-dc$//;  # historical reasons
  s|^|$d\t$p\t|;
' |
python autonaming.py >'streams.json'
