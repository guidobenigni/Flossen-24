// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyDMNctAxovHfw2PMamWttO5qdhfOfg3YwY",
  authDomain: "schwimmen-5d573.firebaseapp.com",
  projectId: "schwimmen-5d573",
  storageBucket: "schwimmen-5d573.appspot.com",
  messagingSenderId: "396100597513",
  appId: "1:396100597513:web:63e922cb1e0590b547c5d8",
  measurementId: "G-12S7DJ7WCC"
};

// Firebase initialisieren
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage(app);

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

  // Prüfen, ob die Gesamtgröße der Dateien 1 MB überschreitet
  const totalSize = registrationFormFile.size + photoFile.size;
  if (totalSize > 1048576) {
    alert("Die Gesamtgröße der Dateien darf nicht größer als 1 MB sein.");
    return;
  }

  try {
    const registrationFormRef = storage.ref().child(`${firstName}_${lastName}_Meldezettel.pdf`);
    const photoRef = storage.ref().child(`${firstName}_${lastName}_Passfoto.jpg`);

    const registrationFormSnapshot = await registrationFormRef.put(registrationFormFile);
    const photoSnapshot = await photoRef.put(photoFile);

    const registrationFormUrl = await registrationFormSnapshot.ref.getDownloadURL();
    const photoUrl = await photoSnapshot.ref.getDownloadURL();

    document.getElementById('output').innerHTML = `
      Dateien hochgeladen: <br>
      <a href="${registrationFormUrl}">Meldezettel</a><br>
      <a href="${photoUrl}">Passfoto</a>
    `;
  } catch (error) {
    console.error('Fehler beim Upload:', error);
    alert('Fehler beim Upload: ' + error.toString());
  }
}

