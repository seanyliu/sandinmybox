function AnimatedUser(map, userManager, userName, userId) {
  this.label = null;
  this.map = map;
  this.marker = null;
  this.userManager = userManager;
  this.userName = userName;
  this.userId = userId;
  this.currentLocation = null;
  this.lastPollTime = -1;
  this.DISTANCE_THRESHOLD = 0; // TODO: update
  this.MINIMUM_POLL_TIME = 1000; // ms
  this.MAXIMUM_POLL_TIME = 1000*60; // ms

  // Drawing parameters
  this.FPS = 30;
  this.MINIMUM_ANIMATION_DISTANCE = 0; // meters

  this.initMarkerAndLabel = function(position) {
    this.initMarker(position);
    this.initLabel(this.marker, this.userName); // call after marker
  }

  this.initMarker = function(position) {
    // Marker sizes are expressed as a Size of X,Y
    // where the origin of the image (0,0) is located
    // in the top left of the image.
    var image = new google.maps.MarkerImage('images/dotwshadow-gray.fw.png',
      // This marker is x pixels wide by y pixels tall.
      new google.maps.Size(17, 19),
      // The origin for this image is 0,0.
      new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      new google.maps.Point(8, 8));

    var newMarker = new google.maps.Marker({
      position: position,
      map: this.map,
      icon: image
    });

    this.marker = newMarker;
  }

  this.initLabel = function(marker) {
    this.label = new Label({
      map: this.map,
      text: this.userName
    });
    this.label.bindTo('position', marker, 'position');
  }

  this.getCurrentTime = function() {
    var date = new Date();
    return date.getTime();
  }

  this.pollLocation = function() {

    // Get the current location for the user
    // TODO: authenticate; We should restrict who can poll whose location
    var newLocation = pollServerForLocation(this.userId);
    var newPollTime = this.getCurrentTime();

    // See if the user is on the move. If not,
    // slow the poll times
    var distanceBetweenLastPoll = 99999; // a big number
    if (this.currentLocation && newLocation) {
      // this.currentLocation defaults to null
      distanceBetweenLastPoll = google.maps.geometry.spherical.computeDistanceBetween(this.currentLocation, newLocation);
    }

    var timeUntilNextPoll = this.MINIMUM_POLL_TIME;
    if (distanceBetweenLastPoll < this.DISTANCETHRESHOLD) {
      // user hasn't moved; exponentially grow the poll time
      timeUntilNextPoll = 2 * (newPollTime - this.lastPollTime);

      // cap the poll time to the maximum
      timeUntilNextPoll = Math.min(timeUntilNextPoll, this.MAXIMUM_POLL_TIME);
    }

    // Call pollLocation again in the future
    var selfObject = this;
    setTimeout(function() {
      selfObject.pollLocation();
    }, timeUntilNextPoll);

    // Update the location
    // get drawn in the draw() loop
    this.currentLocation = newLocation;
    this.lastPollTime = newPollTime;
  }

  this.lastFootprintLatLng = null;
  this.DISTANCE_BETWEEN_FOOTPRINTS = 15; // meters
  this.dropFootprint = function() {
    var dropFootprint = false;
    var distanceToAnimate = google.maps.geometry.spherical.computeDistanceBetween(this.currentLocation, this.marker.getPosition());
    if (distanceToAnimate > this.DISTANCE_BETWEEN_FOOTPRINTS) {
      if (!this.lastFootprintLatLng) {
        dropFootprint = true;
      } else {
        var distanceToLastFootprint = google.maps.geometry.spherical.computeDistanceBetween(this.lastFootprintLatLng, this.marker.getPosition());
        if (distanceToLastFootprint > this.DISTANCE_BETWEEN_FOOTPRINTS) {
          dropFootprint = true;
        }
      }
    }
    if (dropFootprint) {
      this.lastFootprintLatLng = this.marker.getPosition();
      var footprint = new UserFootprint(this.userManager).startupUserFootprint(this.map, this.lastFootprintLatLng);
      this.userManager.addUserObject(footprint);
    }
  }

  this.update = function() {
  }

  this.draw = function() {
    if (!this.marker.getPosition()) {
      this.marker.setPosition(this.currentLocation);
    }

    if (this.currentLocation != null) {
      // drop a footprint where you are now
      this.dropFootprint();

      // Move the user to the correct location within 1 second
      var markerCurrentLocation = this.marker.getPosition();
      var remainingDistanceToAnimate = google.maps.geometry.spherical.computeDistanceBetween(this.currentLocation, markerCurrentLocation); // meters
      var markerDestLocation = this.currentLocation;
      if (remainingDistanceToAnimate > this.MINIMUM_ANIMATION_DISTANCE) {
        var newLat = (1/this.FPS) * this.currentLocation.lat() + (1 - (1/this.FPS)) * markerCurrentLocation.lat();
        var newLng = (1/this.FPS) * this.currentLocation.lng() + (1 - (1/this.FPS)) * markerCurrentLocation.lng();
        markerDestLocation = new google.maps.LatLng(newLat, newLng);
      }
      this.marker.setPosition(markerDestLocation);
    }
  }
 
  // initialization function
  this.startupAnimatedUser = function() {
    this.initMarkerAndLabel(null);

    // initialize a time of last poll to be now
    this.lastPollTime = this.getCurrentTime();

    this.pollLocation();
    this.draw();
    return this;
  }

}

