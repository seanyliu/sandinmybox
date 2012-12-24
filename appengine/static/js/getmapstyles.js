function getMapStyles() {
  return [
    { featureType: "administrative",
      stylers: [
        { visibility: "off" }
      ] },
    { featureType: "all",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ] },
    { featureType: "road",
      elementType: "geometry",
      stylers: [
        { visibility: "simplified" },
        { hue: "#E7DCBF" },
        { saturation: "-50" },
        { lightness: "10" },
      ] },
    { featureType: "road.local",
      elementType: "geometry",
      stylers: [
        { visibility: "off" },
        { hue: "#E7DCBF" },
        { saturation: "-50" },
        { lightness: "-10" },
      ] },
    { featureType: "landscape",
      stylers: [
        { visibility: "simplified" },
        { hue: "#E7DCBF" },
        { saturation: "50" },
        { lightness: "-5" },
        { weight: "100" },
      ] },
    { featureType: "water",
      stylers: [
        { hue: "#EFEBE2" },
        { saturation: "-30" },
        { lightness: "-20" }
      ] },
    { featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        { saturation: '0' },
        { hue: '#E7DCBF' },
      ] },
    { featureType: 'poi.sports_complex',
      elementType: 'geometry',
      stylers: [
        { saturation: '30' },
        { hue: '#E7DCBF' },
      ] },
    { featureType: "transit",
      stylers: [
        { visibility: "off" }
      ] },
  ];
}
