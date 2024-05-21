document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const passport = document.getElementById('passport').value;
    const dob = document.getElementById('dob').value;
    const country = document.getElementById('country').value;

    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '0.50'
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                fetch('https://docs.google.com/forms/d/e/1FAIpQLSdq6QP5SwxxLuVOXmDTcqQgzViSwFu2xvhnb3rHK9Yt5Hp9wQ/viewform?usp=sf_link', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        name: name,
                        email: email,
                        address: address,
                        passport: passport,
                        dob: dob,
                        country: country
                    })
                }).then(response => response.text()).then(data => {
                    alert('Erfolgreich angemeldet und bezahlt.');
                }).catch(error => {
                    console.error('Fehler:', error);
                });
            });
        }
    }).render('#paypal-button-container');
});
