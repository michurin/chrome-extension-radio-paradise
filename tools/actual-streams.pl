#!/usr/bin/perl

use strict;

my $f = join('', <>);
$f =~ s-\s+--g;
my @pp = split(/<h3>/, $f);

foreach my $p (@pp) {
  $p =~ m-ContentType:<[^>]+><[^>]+>([^<]+)<-;
  my $mime = $1;
  $p =~ m-ahref="([^\"]+\.m3u)"-;
  my $m3u = $1;
  print "$mime $ENV{RP_HOST}$m3u\n";
}
