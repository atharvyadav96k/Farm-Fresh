const lo = document.getElementById('location');
const address = document.getElementById('address');
const productForm = document.getElementById('productForm');
document.getElementById('submitform').addEventListener('click', function(){
    if(!productForm.checkValidity()){
      alert('Please fill all data');
    }
})
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Process accurate location data
      console.log(position);
      lo.value = `${position.coords.latitude},${position.coords.longitude}`
      console.log(position.latitude, position.longitude)
      reverseGeocode(position.coords.latitude, position.coords.longitude);
      
    },
    (error) => {
      console.error(error.message);
    }
  );
function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.display_name) {
        console.log(`The address is: ${data.display_name}`);
        address.value = `${data.display_name}`
      } else {
        console.error('Location information not found');
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}