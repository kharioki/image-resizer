const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    alertError('Please select an image');
    // alert('Please select an image');
    img.value = '';
    return;
  }

  // Get original image dimensions
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = () => {
    const { width, height } = image;
    widthInput.value = width;
    heightInput.value = height;
  }

  // show form
  form.style.display = 'block';
  filename.innerText = file.name;
  outputPath.innerText = path.join(os.homedir(), 'imageresizer');
}

// Send image data to main process
function sendImage(e) {
  e.preventDefault();

  const width = widthInput.value;
  const height = heightInput.value;
  const imgPath = img.files[0].path;

  if (!img.files[0]) {
    alertError('Please upload an image');
    return;
  }

  if (width === '' || height === '') {
    alertError('Please fill in a width and height');
    return;
  }

  // Send to main using ipcRenderer
  ipcRenderer.send('image:resize', {
    imgPath,
    width,
    height,
  });
}

// catch image:done
ipcRenderer.on('image:done', () => {
  alertSuccess(`Image resized to ${widthInput.value} x ${heightInput.value}`);
  form.reset();
});

// Make sure file is image
function isFileImage(file) {
  const acceptedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  return file && acceptedImageTypes.includes(file['type']);
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'linear-gradient(to right, #ff5f6d, #ff5000)',
      color: 'white',
      textAlign: 'center',
    },
  });
}

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
      color: 'white',
      textAlign: 'center',
    },
  });
}

img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImage);