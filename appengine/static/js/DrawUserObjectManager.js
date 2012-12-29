function DrawUserObjectManager() {
  this.userObjects = new Array();
  this.FPS = 30;
  this.DRAW_INTERVAL = 1000 / this.FPS;

  this.startupDrawUserObjectManager = function() {
    var selfObject = this;
    window.setInterval(function() {
      selfObject.draw();
    }, this.DRAW_INTERVAL);
    return this;
  }

  this.draw = function() {
    for (x in this.userObjects) {
      if (this.userObjects[x].draw) {
        this.userObjects[x].draw();
      }
    }
  }

  this.addUserObject = function(userObject) {
    this.userObjects.push(userObject);
  }

  this.removeUserObject = function(userObject) {
    this.userObjects.removeObject(userObject);
  }
}

