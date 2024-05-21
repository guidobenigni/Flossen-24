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
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('address', address);
                formData.append('passport', passport);
                formData.append('dob', dob);
                formData.append('country', country);
                
                fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
                    method: 'POST',
                    body: formData
                }).then(response => response.text()).then(data => {
                    alert('Erfolgreich angemeldet und bezahlt.');
                }).catch(error => {
                    console.error('Fehler:', error);
                });
            });
        }
    }).render('#paypal-button-container');
});
