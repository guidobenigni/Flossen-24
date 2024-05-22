// Ursprüngliches JavaScript
const scriptURL = 'https://script.google.com/macros/s/AKfycbztdCqq-lWyJa_eB9eHktr2eTkuf_3wT0Ae188IvhHMN160hQSlN7rpGQPznEMebfHoCw/exec'; // Replace with your deployed script URL
const form = document.forms['registrationForm'];
    
form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            if (response.ok) {
                alert('Anmeldung erfolgreich!');
                form.reset(); // Reset the form after successful submission
            } else {
                alert('Es gab ein Problem mit der Anmeldung.');
            }
        })
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



