const fs = require('fs');
const piexif = require('piexifjs');
const jpeg = require('jpeg-js');
const { createCanvas, loadImage } = require('canvas');

// Utility functions to read and write EXIF data
const getBase64DataFromJpegFile = (filename) => {
  const data = fs.readFileSync(filename);
  return data.toString('binary');
};

const getExifFromJpegFile = (filename) => {
  const base64Data = getBase64DataFromJpegFile(filename);
  return piexif.load(base64Data);
};

// Function to modify EXIF data and save the image
const modifyExifDataAndSaveImage = (imagePath, newExifData, outputPath) => {
  const base64Data = getBase64DataFromJpegFile(imagePath);
  const exifData = piexif.load(base64Data);

  // Modify the EXIF data with new values
  exifData['0th'][piexif.ImageIFD.Make] = newExifData.make;
  exifData['0th'][piexif.ImageIFD.Model] = newExifData.model;
  exifData['0th'][piexif.ImageIFD.DateTime] = newExifData.dateTime;
  console.log(exifData)

  // Convert modified EXIF data back to bytes
  const newExifBytes = piexif.dump(exifData);
  // Insert modified EXIF data back into the image
  const newImageData = piexif.insert(newExifBytes, base64Data);

  // Decode the image using jpeg-js to work with pixel data
  const jpegData = jpeg.decode(Buffer.from(newImageData, 'binary'), true);

  // Create a canvas and draw the image on it
  const canvas = createCanvas(jpegData.width, jpegData.height);
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(jpegData.width, jpegData.height);
  imgData.data.set(new Uint8Array(jpegData.data.buffer));
  ctx.putImageData(imgData, 0, 0);

  // Save the modified image to disk
  const out = fs.createWriteStream(outputPath);
  const jpegBuffer = jpeg.encode(ctx.getImageData(0, 0, canvas.width, canvas.height), 100); // 100 for max quality
  out.write(jpegBuffer.data);
  out.end();

  console.log('Image saved with updated EXIF data.');
};

// Example usage: Read an image, modify its EXIF data, and save it
const imagePath = '../pic1.jpg'; // Path to your JPEG image
const newExifData = {
  make: 'samsung',
  model: '23 pro',
  dateTime: '2024:12:04 10:10:10',
};
const outputPath = 'updated_image.jpg'; // Path to save the modified image

modifyExifDataAndSaveImage(imagePath, newExifData, outputPath);
