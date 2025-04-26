import categoryForm from "../components/categoryForm";
import { caretRight, cross, save } from "./../../assets/icon";
import axios from "axios";

// Cloudinary configuration
const cloudName = 'dzivajta9';
const uploadPreset = 'Practicejs_image';
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

export default class editCategory {
    constructor() {
        this.categoryID = window.location.pathname.split('/').pop();
        this.currentCategory = null;
        this.render().then(() => {
            this.handleImageUpload();
            this.initializeAddCategory();
        });
    }

    fetchCategory = async(id) => {
        try{
            const res = await axios.get(`https://67c09c48b9d02a9f224a690e.mockapi.io/api/cate/${id}`);
            if(res.status === 200){
                return res.data;
            }
            else{
                throw new Error("Failed to fetch category");
            }
        }
        catch(error){
            console.error("Error fetching category:", error);
        }
    }

    initializeAddCategory() {
        const submitButton = document.getElementById('addCategory');
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleEditCategory();
            });
        }
    }

    async handleEditCategory() {
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

        submitButton.disabled = true;
        submitButton.querySelector('.button__text').textContent = 'Saving...';
    
        try {
            let imageUrl = this.currentCategory.image; // Keep existing image by default
            
            // Only upload new image if a file was selected
            if (file) {
                imageUrl = await this.uploadToCloudinary(file);
            }
            
            const categoryData = {
                name,
                description,
                image: imageUrl
            };

            const response = await axios.put(`https://67c09c48b9d02a9f224a690e.mockapi.io/api/cate/${this.categoryID}`, categoryData);
            console.log('Category updated successfully:', response.data);
            
            alert('Category updated successfully!');
            window.location.href = '/category';
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update category. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.querySelector('.button__text').textContent = 'Save Category';
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
        
        if (!imageInput || !emptyState || !previewState) {
            console.error('Image upload elements not found');
            return;
        }
        
        const previewImage = previewState.querySelector('img');
        const removeButton = previewState.querySelector('.thumbnail__preview-remove');
        const addButton = document.querySelector('.thumbnail__add-btn');
        
        if (!previewImage || !removeButton || !addButton) {
            console.error('Image preview elements not found');
            return;
        }

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
        if (!uploadArea) {
            console.error('Upload area not found');
            return;
        }
        
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
            console.log("Remove button clicked");
            imageInput.value = '';
            previewImage.src = '';
            emptyState.style.display = 'flex';
            previewState.style.display = 'none';
        });
    }

    render = async () => {
        const id = this.categoryID;
        this.currentCategory = await this.fetchCategory(this.categoryID);
        
        if (!this.currentCategory) {
            document.querySelector(".content").innerHTML = "<p>Error loading category</p>";
            return;
        }
        
        const bin = `
            <div class="product-list">
                <div class="product-title">
                    <div class="product-title-left">
                        <p class="product-title-left__name">Categories</p>
                        <div class="product-title-left__breadcrumb">
                            <a href="/dashboard"><p class="product-title-left__breadcrumb--active">Dashboard</p></a>
                            <figure><img src="${caretRight}" alt="arrow right" class="product-title__icon" /></figure>
                            <a href="/category"><p class="product-title-left__breadcrumb--active">Category List</p></a>
                            <figure><img src="${caretRight}" alt="arrow right" class="product-title__icon" /></figure>
                            <p class="product-title-left__breadcrumb--normal">Edit Category</p>
                        </div>   
                    </div>
                    <div class="product-title__buttons">  
                        <button class="product-title__buttons--cancel">
                            <figure class="button__icon"><img src="${cross}" alt="icon"/></figure>
                            <span class="button__text">Cancel</span>
                        </button>
                        <button class="product-title__buttons--add" id="addCategory">
                            <figure class="button__icon"><img src="${save}" alt="icon" /></figure>
                            <span class="button__text">Save Category</span>
                        </button>
                    </div>
                </div>
                ${categoryForm({mode: "edit", categoryData: this.currentCategory})}
            </div>
        `;
        
        document.querySelector(".content").innerHTML = bin;
    }
}

