import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';

const OCRComponent = () => {
  const [ocrResult, setOcrResult] = useState('');
  const [processing, setProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setProcessing(true);

    const file = acceptedFiles[0];
    const imgData = await loadImage(file);

    // Apply filters to the image
    const filteredImgData = await applyFilters(imgData);

    // Resize the filtered image
    const resizedImgData = await resizeImage(filteredImgData, 800); // Resize to a maximum width of 800px

    // Show image preview
    setImagePreview(resizedImgData);

    // Perform OCR on the resized and filtered image
    const { data: { text } } = await Tesseract.recognize(resizedImgData, 'eng');

    setOcrResult(text);
    setProcessing(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <h1>OCR with Tesseract.js and react-dropzone</h1>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the image here ...</p> :
            <p>Drag 'n' drop an image here, or click to select an image</p>
        }
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', filter: 'grayscale(1) contrast(1.5) brightness(1)', mixBlendMode: 'multiply' }} />}
      </div>
      {processing && <p>Processing...</p>}
      {ocrResult && (
        <div>
          <h2>OCR Result:</h2>
          <p>{ocrResult}</p>
        </div>
      )}
    </div>
  );
};

// Function to load image using File API and return data URL
const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Function to resize image to a maximum width
const resizeImage = (imgData, maxWidth) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const aspectRatio = img.width / img.height;
      const newWidth = Math.min(maxWidth, img.width);
      const newHeight = newWidth / aspectRatio;
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      resolve(canvas.toDataURL());
    };
    img.src = imgData;
  });
};

// Function to apply filters to the image
const applyFilters = (imgData) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      // Apply filters (e.g., grayscale, contrast, brightness)
      ctx.filter = 'grayscale(100%) contrast(150%) brightness(120%)';
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.src = imgData;
  });
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  margin: '20px 0',
  position: 'relative', // Ensure position for image preview
};

export default OCRComponent;
