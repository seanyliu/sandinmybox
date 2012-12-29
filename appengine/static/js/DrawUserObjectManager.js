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
    for (var x in this.userObjects) {
      if (this.userObjects[x].update) {
        this.userObjects[x].update();
      }
    }
    for (var x in this.userObjects) {
      if (this.userObjects[x].draw) {
        this.userObjects[x].draw();
      }
    }
  }

  this.addUserObject = function(userObject) {
    this.userObjects.push(userObject);
  }

  this.removeUserObject = function(userObject) {
    var objectIndex = -1;
    for (var i=0; i<this.userObjects.length; i++) {
      if (this.userObjects[i] === userObject) {
        objectIndex = i;
      }
    }
    if (objectIndex > -1) {
      this.userObjects.splice(objectIndex,1);
    }
  }
}

