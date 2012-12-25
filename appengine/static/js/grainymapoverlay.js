function GrainyMapOverlay(tileSize) {
  this.tileSize = tileSize;
}

GrainyMapOverlay.prototype.getTile = function(coord, zoom, ownerDocument) {
  var div = ownerDocument.createElement('div');
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.style.backgroundImage = "url(images/tile.png)";
  div.style.opacity = "1.0";
  return div;
};
