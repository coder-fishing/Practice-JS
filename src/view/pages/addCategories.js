import categoryForm from "../components/categoryForm";
import { caretRight ,  download , add } from "./../../assets/icon";
import "./../../assets/css/categoryForm.css";
import axios from 'axios';

const cloudName = 'dzivajta9';
const uploadPreset = 'Practicejs_image';
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

class addCategories {  
    constructor(){
        this.render();
        this.handleImageUpload();
        this.initializeAddCategory();
    }


    redirect(path) {
        window.location.href = path;
    }

    initializeAddCategory() {
        const submitButton = document.getElementById('addCategory');
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleAddCategory();
            });
        }
    }

    async handleAddCategory() {
        const nameInput = document.querySelector('input[name="categoryName"]');
        const descriptionInput = document.querySelector('textarea[name="description"]');
        const imageInput = document.getElementById('imageInput');
        const submitButton = document.getElementById('addCategory');
        const emptyState = document.getElementById('emptyState');
        const previewState = document.getElementById('previewState');
    
        if (!nameInput || !descriptionInput || !imageInput || !emptyState || !previewState) {
            console.error('One or more form elements not found');
            return;
        }
    
        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const file = imageInput.files[0];
    
        if (!name) {
            alert('Please enter a category name');
            nameInput.focus();
            return;
        }
    
        if (!file) {
            alert('Please select an image');
            imageInput.focus();
            return;
        }

        submitButton.disabled = true;
        submitButton.querySelector('.button__text').textContent = 'Adding...';
    
        try {
            const imageUrl = await this.uploadToCloudinary(file);
            const categoryData = {
                name,
                description,
                image: imageUrl
            };

            const response = await axios.post('https://67c09c48b9d02a9f224a690e.mockapi.io/api/cate', categoryData);
            console.log('Category saved successfully:', response.data);
            
            // Reset form
            nameInput.value = '';
            descriptionInput.value = '';
            imageInput.value = '';
            emptyState.style.display = 'flex';
            previewState.style.display = 'none';
            
            alert('Category added successfully!');
            this.redirect('/category');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add category. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.querySelector('.button__text').textContent = 'Add Category';
        }
    }
    

    async uploadToCloudinary(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            const response = await axios.post(uploadUrl, formData);
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw new Error('Failed to upload image');
        }
    }

    handleImageUpload() {
        const imageInput = document.getElementById('imageInput');
        const emptyState = document.getElementById('emptyState');
        const previewState = document.getElementById('previewState');
        const previewImage = previewState.querySelector('img');
        const removeButton = previewState.querySelector('.thumbnail__preview-remove');
        const addButton = document.querySelector('.thumbnail__add-btn');

        // Handle click on add button
        addButton.addEventListener('click', () => {
            imageInput.click();
        });

        // Handle file selection
        imageInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    emptyState.style.display = 'none';
                    previewState.style.display = 'block';
                };
                reader.readAsDataURL(file);

                // Upload to Cloudinary
                try {
                    const imageUrl = await this.uploadToCloudinary(file);
                    console.log('Upload successful:', imageUrl);
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
                
            }
        });

    
        const uploadArea = document.querySelector('.thumbnail__upload-area');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }


        uploadArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const file = dt.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    emptyState.style.display = 'none';
                    previewState.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        }

        // Handle remove button
        removeButton.addEventListener('click', () => {
            imageInput.value = '';
            previewImage.src = '';
            emptyState.style.display = 'flex';
            previewState.style.display = 'none';
        });
    }

    render(){
        const content = `
           <div class="product-list">
                <div class="product-title">
                    <div class="product-title-left">
                        <p class="product-title-left__name">Categories</p>
                        <div class="product-title-left__breadcrumb">
                            <p class="product-title-left__breadcrumb--active">Dashboard</p>
                            <figure>
                                <img src="${caretRight}" alt="arrow right" class="product-title__icon" />
                            </figure>
                            <p class="product-title-left__breadcrumb--active">Category List</p>
                            <figure>
                                <img src="${caretRight}" alt="arrow right" class="product-title__icon" />
                            </figure>
                            <p class="product-title-left__breadcrumb--normal">Add Category</p>
                        </div>
                    </div>

                    <div class="product-title__buttons">
                        <button class="product-title__buttons--download">
                            <img src="${download}" alt="icon" class="button__icon" />
                            <span class="button__text">Export</span>
                        </button>
                        <button class="product-title__buttons--add" id="addCategory">
                            <img src="${add}" alt="icon" class="button__icon" />
                            <span class="button__text" >Add Category</span>
                        </button>
                    </div>
                </div>
           </div>
           ${categoryForm({mode: 'create'})}
        `
        console.log("content");
        document.querySelector(".content").innerHTML = content;
    }
}

export default addCategories; 