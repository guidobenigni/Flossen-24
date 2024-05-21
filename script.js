document.addEventListener('DOMContentLoaded', function () {
  paypal.Buttons({
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: '250.00'  // Richtiger Betrag für die Anmeldung
          }
        }]
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        const formData = new FormData(document.getElementById('registrationForm'));

        // Send form data to Google Form after successful payment
        fetch('URL_OF_YOUR_GOOGLE_FORM', {
          method: 'POST',
          body: formData
        }).then(response => {
          if (response.ok) {
            alert('Zahlung erfolgreich! Anmeldung abgeschlossen.');
          } else {
            alert('Fehler bei der Anmeldung. Bitte versuchen Sie es erneut.');
          }
        }).catch(error => {
          alert('Fehler bei der Anmeldung. Bitte versuchen Sie es erneut.');
        });
      });
    }
  }).render('#paypal-button-container');
});

