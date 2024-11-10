const data = document.getElementById('data');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', function () {
  const value = {
    data: data.value
  }
  fetch('/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(value)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.data)
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
)