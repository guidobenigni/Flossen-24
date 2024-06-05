async function uploadFile(event) {
  event.preventDefault();
  const form = document.getElementById('myForm');
  const formData = new FormData(form);

  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const registrationFormFile = formData.get('registrationForm');
  const photoFile = formData.get('photo');

  if (registrationFormFile.size > 1048576 || photoFile.size > 1048576) {
    alert("Dateien dürfen nicht größer als 1 MB sein.");
    return;
  }

  const photo = new Image();
  photo.onload = async function() {
    if (this.width < 425 || this.height < 566) {
      alert("Das Passfoto muss mindestens 425x566 Pixel groß sein.");
      return;
    } else {
      const reader1 = new FileReader();
      const reader2 = new FileReader();

      reader1.readAsDataURL(registrationFormFile);
      reader2.readAsDataURL(photoFile);

      reader1.onload = async function() {
        reader2.onload = async function() {
          const registrationFormBase64 = reader1.result.split(',')[1];
          const photoBase64 = reader2.result.split(',')[1];

          const data = {
            firstName: firstName,
            lastName: lastName,
            registrationForm: registrationFormBase64,
            registrationFormMimeType: registrationFormFile.type,
            photo: photoBase64,
            photoMimeType: photoFile.type
          };

          try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbzU41aN7s9cLPfoEZ5Il01Tv6dg3bSPaXiIxrEhNdIUz9S7-QUr33YosWeXRs9qWaFV/exec', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.status === 'success') {
              document.getElementById('output').innerHTML = `
                Dateien hochgeladen: <br>
                <a href="${result.registrationFileUrl}">Meldezettel</a><br>
                <a href="${result.photoFileUrl}">Passfoto</a>
              `;
            } else {
              alert('Fehler: ' + result.message);
            }
          } catch (error) {
            alert('Fehler: ' + error.toString());
          }
        };
      };
    }
  };
  photo.src = URL.createObjectURL(photoFile);
}
