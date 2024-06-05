function uploadFile() {
  var form = document.getElementById('myForm');
  var registrationForm = form.registrationForm.files[0];
  var photo = form.photo.files[0];

  if (registrationForm.size > 1048576 || photo.size > 1048576) {
    alert("Dateien dürfen nicht größer als 1 MB sein.");
    return;
  }

  var img = new Image();
  img.onload = function() {
    if (this.width < 425 || this.height < 566) {
      alert("Das Passfoto muss mindestens 425x566 Pixel groß sein.");
      return;
    } else {
      var formData = new FormData(form);
      google.script.run.withSuccessHandler(updateOutput).uploadFile(formData);
    }
  };
  img.src = URL.createObjectURL(photo);
}

function updateOutput(output) {
  document.getElementById('output').innerHTML = output;
}

function handleSubmit(event) {
  event.preventDefault();
  alert("Formular erfolgreich eingereicht!");
  // Hier können Sie zusätzliche Aktionen beim Abschluss des Formulars ausführen
}



