let uploadedImage;

document.getElementById("file-input").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const image = new Image();
      image.onload = function () {
        uploadedImage = image;

        // Extract EXIF metadata after image is loaded
        EXIF.getData(image, function () {
          // Extract EXIF data, checking if each tag exists
          const orientation = EXIF.getTag(image, "Orientation");
          const dateTime = EXIF.getTag(image, "DateTime");
          const make = EXIF.getTag(image, "Make");
          const model = EXIF.getTag(image, "Model");

          // Pre-fill the form with metadata, using default if not available
          document.getElementById("orientation").value = orientation || "1"; // Default to '1' if undefined
          document.getElementById("dateTime").value = dateTime || "N/A";
          document.getElementById("make").value = make || "N/A";
          document.getElementById("model").value = model || "N/A";

          // Display the width, height, and size of the image
          document.getElementById("width").textContent = image.width || "N/A";
          document.getElementById("height").textContent = image.height || "N/A";
          document.getElementById("size").textContent = (file.size / 1024).toFixed(2) + " KB" || "N/A";
        });
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("metadata-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const orientation = document.getElementById("orientation").value;
  const dateTime = document.getElementById("dateTime").value;
  const make = document.getElementById("make").value;
  const model = document.getElementById("model").value;

  // Create a canvas to work with
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = uploadedImage.width;
  canvas.height = uploadedImage.height;
  ctx.drawImage(uploadedImage, 0, 0);

  // Get EXIF data from the uploaded image
  EXIF.getData(uploadedImage, function () {
    let exifData = EXIF.getAllTags(uploadedImage);
  
    // Modify EXIF data based on form input
    exifData.Orientation = orientation || 1; // Default to '1' if undefined
    exifData.DateTime = dateTime || "unknown";
    exifData.Make = make || "unknown";
    exifData.Model = model || "unknown";
  
    // Use piexif.js to insert new EXIF data
    let exifBytes = piexif.dump(exifData);
    let newExifData = piexif.insert(exifBytes, canvas.toDataURL("image/jpeg"));
  
    // Create a new image with updated EXIF data and trigger the download
    canvas.toBlob(function (blob) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "modified_image_with_metadata.jpg";
      a.click(); // Trigger the download
    }, "image/jpeg");
  });
  
});
