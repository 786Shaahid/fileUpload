document.addEventListener('DOMContentLoaded', function() {
    const dropzone = document.getElementById('dropzone');
    const fileList = document.getElementById('fileList');
    const fileInput = document.getElementById('fileInput');

    let images = JSON.parse(localStorage.getItem('images')) || [];

    // Function to update local storage
    function updateLocalStorage() {
        localStorage.setItem('images', JSON.stringify(images));
    }

    // Function to handle dropping files into drop zone
    function handleDrop(e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleFiles(files);
    }

    // Function to handle selected files from input
    function handleFileInput(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    // Function to handle files (both drop and input)
    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/') && file.size < 1000000) {
                handleImage(file);
            } else {
                alert('Please upload only images (less than 1MB).');
            }
        });

        if (images.length >= 5) {
            alert('You can upload a maximum of 5 images.');
        }
    }

    // Function to handle individual image processing
    function handleImage(file) {
        const reader = new FileReader();
        reader.onload = function() {
            const imgData = reader.result;
            const index = images.length;

            const listItem = createListItem(imgData, index);
            fileList.appendChild(listItem);

            images.push({ src: imgData, description: '' });
            updateLocalStorage();
        };
        reader.readAsDataURL(file);
    }

    // Function to create a list item for an image
    function createListItem(imgData, index) {
        const listItem = document.createElement('div');
        listItem.classList.add('file-item');

        const imgElement = document.createElement('img');
        imgElement.src = imgData;
        listItem.appendChild(imgElement);

        const descriptionInput = createDescriptionInput(index);
        listItem.appendChild(descriptionInput);

        const checkIcon = createCheckIcon();
        listItem.appendChild(checkIcon);

        const deleteIcon = createDeleteIcon(index);
        listItem.appendChild(deleteIcon);

        return listItem;
    }

    // Function to create description input for an image
    function createDescriptionInput(index) {
        const descriptionInput = document.createElement('textarea');
        descriptionInput.placeholder = 'Add a description...';
        descriptionInput.addEventListener('input', function() {
            images[index].description = descriptionInput.value;
            updateLocalStorage();
        });
        return descriptionInput;
    }

    // Function to create check icon
    function createCheckIcon() {
        const checkIcon = document.createElement('span');
        checkIcon.textContent = '✔️';
        checkIcon.classList.add('check-icon');
        checkIcon.addEventListener('click', function() {
            alert('Description has been added.');
            // Optionally disable the description input after adding
            // descriptionInput.disabled = true;
        });
        return checkIcon;
    }

    // Function to create delete icon
    function createDeleteIcon(index) {
        const deleteIcon = document.createElement('span');
        deleteIcon.textContent = '❌';
        deleteIcon.classList.add('delete-icon');
        deleteIcon.addEventListener('click', function() {
            fileList.removeChild(deleteIcon.parentElement);
            images.splice(index, 1);
            updateLocalStorage();
        });
        return deleteIcon;
    }

    // Event listeners for drop zone
    dropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', handleDrop);

    // Event listener for file input
    fileInput.addEventListener('change', handleFileInput);

    // Initial load of images from local storage
    images.forEach(function(image, index) {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;

        const listItem = createListItem(image.src, index);
        fileList.appendChild(listItem);

        const descriptionInput = listItem.querySelector('textarea');
        descriptionInput.value = image.description;
    });
});
