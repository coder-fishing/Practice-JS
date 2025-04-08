import productForm from "../components/productForm.js";
import axios from "axios";
import { caretRight, cross, save } from "./../../assets/icon";

// Cloudinary configuration
const cloudName = 'dzivajta9';
const uploadPreset = 'Practicejs_image';
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

export class editProduct {
    constructor() {
        this.productId = window.location.pathname.split('/').pop();
        this.currentProduct = null;
        this.render();
    }

    async loadCategories() {
        try {
            const response = await axios.get('https://67c09c48b9d02a9f224a690e.mockapi.io/api/cate');
            const categories = response.data;
            
            const dropdownContent = document.getElementById('dropdownContentTop');
            const dropdownButton = document.getElementById('dropdownButtonTop');
            
            if (dropdownContent) {
                dropdownContent.innerHTML = categories.map(category => `
                    <div data-value="${category.name}" 
                         data-id="${category.categoryID}">
                    ${category.name}</div>
                `).join('');

                // Set initial category if product exists
                if (this.currentProduct && this.currentProduct.category_ID) {
                    const selectedCategory = categories.find(cat => cat.categoryID === this.currentProduct.category_ID);
                    if (selectedCategory && dropdownButton) {
                        dropdownButton.textContent = selectedCategory.name;
                        dropdownButton.setAttribute('data-selected-id', selectedCategory.categoryID);
                        console.log("Selected category:", selectedCategory);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            const response = await axios.post(uploadUrl, formData);
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    };

    dropdown = (id, btn, content, text = null) => {
        const dropdown = document.getElementById(id);
        const dropdownButton = document.getElementById(btn);
        const dropdownContent = document.getElementById(content);
        const statusText = text ? document.getElementById(text) : null;
        const items = dropdownContent.querySelectorAll('div');

        items.forEach(item => {
            item.addEventListener('click', (e) => {
                const selectedValue = e.target.getAttribute('data-value');
                const selectedId = e.target.getAttribute('data-id');
                dropdownButton.textContent = selectedValue;
                
                if (selectedId) {
                    dropdownButton.setAttribute('data-selected-id', selectedId);
                }

                if (statusText) {
                    statusText.textContent = selectedValue;
                    const name = selectedValue.replace(/\s+/g, '-').toLowerCase();
                    statusText.classList.remove('draft', 'published', 'out-of-stock', 'low-stock');
                    statusText.classList.add(name);
                }

                dropdownContent.style.display = 'none';
            });
        });

        dropdownButton.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdownContent.style.display = 'none';
            }
        });
    };

    addimage = () => {        
        const emptyState = document.getElementById('emptyState');
        const filledState = document.getElementById('filledState');
        const imageInputEmpty = document.getElementById('imageInputEmpty');
        const imageInputFilled = document.getElementById('imageInputFilled');
        const btns = document.querySelectorAll('.media__upload-btn');
        const previewImages = document.querySelectorAll('.preview-img');
        const frames = document.querySelectorAll('.list-image-preview');

        let currentImages = [];
        
        // Kiểm tra xem có ảnh nào đã được hiển thị chưa
        const hasExistingImages = Array.from(previewImages).some(img => img.src && img.src !== '');
        
        if (!hasExistingImages) {
            filledState.style.display = 'none';
            emptyState.style.display = 'flex';
        } else {
            filledState.style.display = 'flex';
            emptyState.style.display = 'none';
            
            // Lưu các ảnh hiện có vào currentImages
            previewImages.forEach(img => {
                if (img.src && img.src !== '') {
                    currentImages.push(img.src);
                }
            });
        }

        if (btns.length > 1) {
            btns[0].addEventListener('click', () => imageInputEmpty.click());
            btns[1].addEventListener('click', () => imageInputFilled.click());
        }

        // Thêm sự kiện xóa ảnh
        const deleteButtons = document.querySelectorAll('.delete-image');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const frame = frames[index];
                const img = previewImages[index];
                
                // Xóa ảnh
                img.src = '';
                frame.style.display = 'none';
                
                // Cập nhật currentImages
                if (currentImages[index]) {
                    currentImages[index] = null;
                }
                
                // Kiểm tra xem còn ảnh nào không
                const remainingImages = Array.from(previewImages).filter(img => img.src && img.src !== '');
                if (remainingImages.length === 0) {
                    filledState.style.display = 'none';
                    emptyState.style.display = 'flex';
                }
            });
        });

        async function handleImageUpload(event) {
            const files = event.target.files;
            
            if (files.length > 0) {
                try {
                    const newFiles = Array.from(files);
                    
                    // Tìm vị trí trống đầu tiên
                    let emptySlotIndex = -1;
                    previewImages.forEach((img, index) => {
                        if (emptySlotIndex === -1 && (!img.src || !img.src.includes('cloudinary'))) {
                            emptySlotIndex = index;
                        }
                    });

                    // Nếu không có vị trí trống, không thêm ảnh nữa
                    if (emptySlotIndex === -1) {
                        alert("All image slots are filled. Please remove an image first.");
                        return;
                    }

                    emptyState.style.display = 'none';
                    filledState.style.display = 'flex';

                    // Xử lý từng file
                    for (let i = 0; i < newFiles.length; i++) {
                        if (emptySlotIndex + i < previewImages.length) {
                            const file = newFiles[i];
                            // Hiển thị ảnh tạm thời
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                frames[emptySlotIndex + i].style.display = 'block';
                                previewImages[emptySlotIndex + i].src = e.target.result;
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                } catch (error) {
                    console.error('Error handling images:', error);
                    alert('Error uploading images. Please try again.');
                }
            }
        }

        imageInputEmpty.addEventListener('change', handleImageUpload);
        imageInputFilled.addEventListener('change', handleImageUpload);
    };

    fetchProduct = async (id) => {
        try {
            const res = await axios.get(`https://67c09c48b9d02a9f224a690e.mockapi.io/api/product/${id}`);
            console.log("Fetched data:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error fetching product:", error);
            return null;
        }
    };

    getProductData = () => { 
        const images = Array.from(document.querySelectorAll(".preview-img"));   
        const dropdownButton = document.getElementById("dropdownButtonTop");
        const categoryId = dropdownButton ? dropdownButton.getAttribute("data-selected-id") : null;
        const statusText = document.getElementById('status-text');
        
        return {
            name: document.querySelector('input[name="productName"]').value.trim(),
            sku: document.querySelector('input[name="sku"]').value.trim(),
            category: dropdownButton ? dropdownButton.textContent : 'None',
            category_ID: categoryId,
            price: document.querySelector('input[name="basePrice"]').value.trim(),
            status: statusText ? statusText.textContent.trim() : 'Draft',
            added: new Date().toISOString(),
            description: document.querySelector('textarea[name="description"]')?.value.trim() || '',
            stock: document.querySelector('input[name="quantity"]')?.value.trim() || '0',
            ImageSrc: {
                firstImg: images.length > 0 ? images[0].src : null,
                secondImg: images.length > 1 ? images[1].src : null,
                thirdImg: images.length > 2 ? images[2].src : null,
            }
        };
    };

    validateProductData = (data) => {
        if (!data.name.trim()) {
            alert("Product name is required");
            return false;
        }
        if (!data.sku.trim()) {
            alert("SKU is required");
            return false;
        }
        if (!data.category || data.category === "None") {
            alert("Category is required");
            return false;
        }
        if (!data.price || isNaN(data.price) || data.price <= 0) {
            alert("Valid price is required");
            return false;
        }
        if (!data.stock || isNaN(data.stock) || data.stock < 0) {
            alert("Valid stock quantity is required");
            return false;
        }
        return true;
    };

    handleEditProduct = (product) => {
        const saveBtn = document.querySelector("#addProduct");
        const cancelBtn = document.querySelector(".product-title__buttons--cancel");

        // Set initial status
        const statusText = document.getElementById('status-text');
        const dropdownButton = document.getElementById('dropdownButton');
        if (statusText && dropdownButton) {
            const status = product.status || 'Draft';
            statusText.textContent = status;
            dropdownButton.textContent = status;
            const statusClass = status.toLowerCase().replace(/\s+/g, '-');
            statusText.className = `form-section__title-status--label-text ${statusClass}`;
        }

        saveBtn.addEventListener("click", async () => {
            try {
                const images = Array.from(document.querySelectorAll(".preview-img"));
                const imageFiles = Array.from(document.querySelectorAll('input[type="file"]')).map(input => input.files[0]).filter(file => file);
                
                const uploadedImages = await Promise.all(
                    imageFiles.map(file => this.uploadToCloudinary(file))
                );

                const imageUrls = {
                    firstImg: null,
                    secondImg: null,
                    thirdImg: null
                };

                let uploadedIndex = 0;

                for (let i = 0; i < images.length; i++) {
                    if (images[i]?.src) {
                        if (images[i].src.includes('cloudinary')) {
                            imageUrls[`${i === 0 ? 'first' : i === 1 ? 'second' : 'third'}Img`] = images[i].src;
                        } else if (images[i].src.includes('data:image')) {
                            if (uploadedIndex < uploadedImages.length) {
                                imageUrls[`${i === 0 ? 'first' : i === 1 ? 'second' : 'third'}Img`] = uploadedImages[uploadedIndex];
                                uploadedIndex++;
                            }
                        }
                    }
                }

                const productData = this.getProductData();
                productData.ImageSrc = imageUrls;

                if (!this.validateProductData(productData)) {
                    return;
                }

                const response = await axios.put(`https://67c09c48b9d02a9f224a690e.mockapi.io/api/product/${this.productId}`, productData);
                console.log("Server response:", response.data);
                alert("Product updated successfully");
                window.location.href = "/";
            } catch (error) {
                console.error("Error updating product:", error);
                alert("Error updating product. Please try again.");
            }
        });

        cancelBtn.addEventListener("click", () => {
            window.location.href = "/";
        });
    };

    render = async () => {
        // Lấy ID từ URL
        const id = this.productId;
        this.currentProduct = await this.fetchProduct(id);
        
        if (!this.currentProduct) {
            document.querySelector(".content").innerHTML = "<p>Error loading product</p>";
            return;
        }

        this.currentProduct.div = this.currentProduct.status.toLowerCase().replace(/\s+/g, '-');
        console.log("Current product:", this.currentProduct);
       
        const content = `
        <div class="product-list">
            <div class="product-title">
                <div class="product-title-left">
                    <p class="product-title-left__name">Product</p>
                    <div class="product-title-left__breadcrumb">
                        <a href="/dashboard"><p class="product-title-left__breadcrumb--active">Dashboard</p></a>
                        <figure><img src="${caretRight}" alt="arrow right" class="product-title__icon" /></figure>
                        <a href="/"><p class="product-title-left__breadcrumb--active">Product List</p></a>
                        <figure><img src="${caretRight}" alt="arrow right" class="product-title__icon" /></figure>
                        <p class="product-title-left__breadcrumb--normal">Edit Product</p>
                    </div>   
                </div>
                <div class="product-title__buttons">  
                    <button class="product-title__buttons--cancel">
                        <figure class="button__icon"><img src="${cross}" alt="icon"/></figure>
                        <span class="button__text">Cancel</span>
                    </button>
                    <button class="product-title__buttons--add" id="addProduct">
                        <figure class="button__icon"><img src="${save}" alt="icon" /></figure>
                        <span class="button__text">Save product</span>
                    </button>
                </div>
            </div>
            ${productForm({ mode: 'edit', productData: this.currentProduct })}
        </div>`;

        document.querySelector(".content").innerHTML = content;

        // Load categories after rendering the form
        await this.loadCategories();
        
        this.dropdown('dropdown', 'dropdownButton', 'dropdownContent', 'status-text');
        this.dropdown('dropdowntop', 'dropdownButtonTop', 'dropdownContentTop');
        this.addimage();
        this.handleEditProduct(this.currentProduct);
    };
}