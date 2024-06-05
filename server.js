const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

const app = express();
const port = process.env.PORT || 3000; 

// Erstelle eine Instanz der Google Cloud Storage API
const storage = new Storage();
const bucketName = 'your-bucket-name'; // Ersetze durch den Namen deines Buckets

// Konfiguriere Multer für den Upload von Dateien
const upload = multer({ dest: 'uploads/' });

// Parse body-requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route für Datei-Uploads
app.post('/upload', upload.single('registrationForm'), async (req, res) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const registrationForm = req.file; 
    const photo = req.files.photo; // Wenn mehrere Dateien hochgeladen werden

    // Erstelle den Ordnernamen
    const folderName = `${firstName}_${lastName}`;

    // Lade die Dateien hoch
    const [file1] = await storage
      .bucket(bucketName)
      .upload(registrationForm.path, {
        destination: `${folderName}/${registrationForm.originalname}`,
      });

    const [file2] = await storage
      .bucket(bucketName)
      .upload(photo.path, {
        destination: `${folderName}/${photo.originalname}`,
      });

    // Erstelle einen öffentlichen Link für den Ordner
    const [url] = await file1.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // Gültigkeitsdauer des Links
    });

    res.json({
      message: 'Dateien erfolgreich hochgeladen!',
      folderUrl: url,
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Fehler beim Hochladen der Dateien.' });
  }
});

// Starte den Server
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
