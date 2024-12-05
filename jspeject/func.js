let uploadedImage;
let imageFile; // Store the image file for later use

// Load and read EXIF metadata from the image
document.getElementById("file-input").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    imageFile = file; // Save the original file

    const reader = new FileReader();
    reader.onload = function (e) {
      const image = new Image();
      image.onload = function () {
        uploadedImage = image;

        // Extract EXIF metadata from the image
        EXIF.getData(image, function () {
          const metadata = EXIF.getAllTags(image);
          console.log(metadata); // Log metadata for debugging

          // Fill the form with metadata if available
          document.getElementById("dateTime").value = metadata.DateTime || '';
          document.getElementById("make").value = metadata.Make || '';
          document.getElementById("model").value = metadata.Model || '';
        });
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Handle form submission to modify and save the image
document.getElementById("metadata-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Extract new metadata from form inputs
  const dateTime = document.getElementById("dateTime").value;
  const make = document.getElementById("make").value;
  const model = document.getElementById("model").value;

  if (!imageFile) {
    alert("No image uploaded!");
    return;
  }

  // Modify EXIF data
  const piexif = window.piexif;

  // Convert the image to base64 to modify EXIF data
  const reader = new FileReader();
  reader.onload = function (e) {
    const imageData = e.target.result;

    // Load EXIF data from the image
    let exifData = piexif.load(imageData);

    // Update EXIF data based on form input
    if (make) exifData['0th'][piexif.ImageIFD.Make] = make;
    if (model) exifData['0th'][piexif.ImageIFD.Model] = model;
    if (dateTime) exifData['0th'][piexif.ImageIFD.DateTime] = dateTime;

    // Dump the modified EXIF data and insert it back into the image
    const exifBytes = piexif.dump(exifData);
    const newExifData = piexif.insert(exifBytes, imageData);

    // Create a new image with updated EXIF data
    const a = document.createElement("a");
    a.href = newExifData;
    a.download = "updated_image.jpg"; // Set the download filename
    a.click(); // Trigger the download
  };

  reader.readAsDataURL(imageFile); // Read the file as Data URL
});
