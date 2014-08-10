<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="text"/>
<xsl:template match="/">
  <xsl:text>*** links/imgs:&#xa;</xsl:text>
  <xsl:for-each select="//a">
    <xsl:text>&#xa;</xsl:text>
    <xsl:value-of select="./@target"/>
    <xsl:text> </xsl:text>
    <xsl:value-of select="./@href"/>
    <xsl:choose>
      <xsl:when test="img">
        <xsl:text>&#xa;   src </xsl:text>
        <xsl:value-of select="./img/@src"/>
        <xsl:text>&#xa;</xsl:text>
      </xsl:when>
      <xsl:otherwise>
        <xsl:text> "</xsl:text>
        <xsl:value-of select="."/>
        <xsl:text>"&#xa;</xsl:text>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:for-each>
</xsl:template>
</xsl:stylesheet>
