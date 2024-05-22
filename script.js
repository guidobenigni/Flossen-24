// Ursprüngliches JavaScript
const scriptURL = 'https://script.google.com/macros/s/AKfycbzXLN59fHOW46nSOYPnZYXZlcdP7Pn01X2xad28xiYvViO6EpyC7NGl_B1V7_gw7fmHUg/exec';
const form = document.forms['registrationForm'];
    
form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => alert('Anmeldung erfolgreich!'))
        .catch(error => console.error('Fehler!', error.message));
});

// Hinzugefügtes JavaScript
document.getElementById('usePaypal').addEventListener('change', function() {
    var paypalContainer = document.getElementById('paypal-button-container');
    if (this.checked) {
        paypalContainer.style.display = 'block';
        paypal.Buttons().render('#paypal-button-container');
    } else {
        paypalContainer.style.display = 'none';
    }
});

document.getElementById('togglePrivacy').addEventListener('click', function() {
    var privacyPolicy = document.getElementById('privacyPolicy');
    if (privacyPolicy.style.display === 'none' || privacyPolicy.style.display === '') {
        privacyPolicy.style.display = 'block';
    } else {
        privacyPolicy.style.display = 'none';
    }
});


