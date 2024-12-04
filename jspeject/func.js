let uploadedImage;
const getBase64DataFromJpegFile = (filename) => {
  const data = fs.readFileSync(filename);
  return data.toString('binary');
};
// Load and read EXIF metadata from the image
document.getElementById("file-input").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
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
          document.getElementById("dateTime").value = metadata.DateTime;
          document.getElementById("make").value = metadata.Make ;
          document.getElementById("model").value = metadata.Model;
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

  // Modify EXIF data
  EXIF.getData(uploadedImage, function () {
    const piexif = window.piexif;
    console.log(uploadedImage)

    const base64Data = getBase64DataFromJpegFile(uploadedImage);
    const exifData = piexif.load("./pic1.jpg");
    console.log(exifData)

    // Update EXIF data based on form input
    exifData['0th'][piexif.ImageIFD.Make] = make;
    exifData['0th'][piexif.ImageIFD.Model] = model;
    exifData['0th'][piexif.ImageIFD.DateTime] = dateTime;
    let exifBytes = piexif.dump(exifData);
    let newExifData = piexif.insert(exifBytes, uploadedImage.src);
    console.log(exifData)

    // Create a new image with updated EXIF data
   
      const a = document.createElement("a");
      a.href =newExifData;
      a.download = "updated_image.jpg"; // Set the download filename
      a.click(); // Trigger the download
      alert("Image updated and ready to download.");
   
  });
});