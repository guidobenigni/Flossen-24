async function uploadFile(event) {
  event.preventDefault();
  const form = document.getElementById('myForm');
  const formData = new FormData(form);

  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const registrationFormFile = formData.get('registrationForm');
  let photoFile = formData.get('photo');

  // HEIC-Bilder in JPEG umwandeln
  if (photoFile.type === 'image/heic') {
    try {
      const convertedBlob = await heic2any({
        blob: photoFile,
        toType: 'image/jpeg',
      });
      photoFile = new File([convertedBlob], photoFile.name.replace(/\.[^/.]+$/, ".jpg"), { type: 'image/jpeg' });
    } catch (e) {
      alert("Fehler bei der Umwandlung von HEIC zu JPEG: " + e.message);
      return;
    }
  }

  try {
    // Verkleinern des Bildes
    const resizedPhotoBlob = await resizeImage(photoFile, 425, 566, 1 * 1024 * 1024); // Maximal 1 MB

    // Prüfen, ob die Gesamtgröße der Dateien 1 MB überschreitet
    const totalSize = registrationFormFile.size + resizedPhotoBlob.size;
    if (totalSize > 1048576) {
      alert("Die Gesamtgröße der Dateien darf nicht größer als 1 MB sein.");
      return;
    }

    const reader1 = new FileReader();
    reader1.readAsDataURL(registrationFormFile);

    reader1.onload = async function() {
      const registrationFormBase64 = reader1.result.split(',')[1];

      const reader2 = new FileReader();
      reader2.readAsDataURL(resizedPhotoBlob);

      reader2.onload = async function() {
        const resizedPhotoBase64 = reader2.result.split(',')[1];

        const data = {
          firstName: firstName,
          lastName: lastName,
          registrationForm: registrationFormBase64,
          registrationFormMimeType: registrationFormFile.type,
          photo: resizedPhotoBase64,
          photoMimeType: 'image/jpeg' // Wir verwenden JPEG als Standard für die verkleinerten Bilder
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
          console.error('Fehler bei der Anfrage:', error);
          alert('Fehler bei der Anfrage: ' + error.toString());
        }
      };
      reader2.onerror = function(error) {
        console.error('Fehler beim Lesen des Fotos:', error);
        alert('Fehler beim Lesen des Fotos: ' + error.toString());
      };
      reader2.readAsDataURL(resizedPhotoBlob);
    };
    reader1.onerror = function(error) {
      console.error('Fehler beim Lesen des Meldezettels:', error);
      alert('Fehler beim Lesen des Meldezettels: ' + error.toString());
    };
  } catch (error) {
    console.error('Fehler beim Verkleinern des Bildes:', error);
    alert('Fehler beim Verkleinern des Bildes: ' + error.toString());
  }
}

function resizeImage(file, maxWidth, maxHeight, maxSize) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round(height * maxWidth / width);
          width = maxWidth;
        } else {
          width = Math.round(width * maxHeight / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.9; // Start quality
      canvas.toBlob(blob => {
        if (blob.size > maxSize) {
          quality -= 0.1;
          if (quality < 0.1) {
            reject(new Error("Image cannot be resized below 1 MB"));
            return;
          }
          resizeImageBlob(canvas, quality, resolve, reject, maxSize);
        } else {
          resolve(blob);
        }
      }, 'image/jpeg', quality);
    };
    img.onerror = function(error) {
      console.error('Fehler beim Laden des Bildes:', error);
      reject('Fehler beim Laden des Bildes: ' + error.toString());
    };
  });
}

function resizeImageBlob(canvas, quality, resolve, reject, maxSize) {
  canvas.toBlob(blob => {
    if (blob.size > maxSize) {
      quality -= 0.1;
      if (quality < 0.1) {
        reject(new Error("Image cannot be resized below 1 MB"));
        return;
      }
      resizeImageBlob(canvas, quality, resolve, reject, maxSize);
    } else {
      resolve(blob);
    }
  }, 'image/jpeg', quality);
}
