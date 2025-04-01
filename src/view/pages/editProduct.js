import productForm from "../components/productForm.js";
import axios from "axios";
import { caretRight, cross, save } from "./../../assets/icon";

// Cloudinary configuration
const cloudName = 'dzivajta9';
const uploadPreset = 'Practicejs_image';
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

export class editProduct {
    constructor() {
        this.render(); 
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

        if (!dropdown || !dropdownButton || !dropdownContent) {
            console.error(`Dropdown elements not found: ${id}, ${btn}, ${content}`);
            return;
        }

        const items = dropdownContent.querySelectorAll('div');

        items.forEach(item => {
            item.addEventListener('click', (e) => {
                const selectedValue = e.target.getAttribute('data-value');
                dropdownButton.textContent = selectedValue;

                if (statusText) {
                    statusText.textContent = selectedValue;
                    const name = selectedValue.replace(/\s+/g, '-').toLowerCase();
                    statusText.classList.remove('draft', 'publish', 'out-of-stock', 'stock');
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

        if (!emptyState || !filledState || !imageInputEmpty || !imageInputFilled) {
            console.error("Image upload elements not found");
            return;
        }

        // Kiểm tra xem có ảnh nào đã được hiển thị chưa
        const hasExistingImages = Array.from(previewImages).some(img => img.src && img.src !== '');
        
        // Chỉ ẩn filledState nếu không có ảnh nào
        if (!hasExistingImages) {
            filledState.style.display = 'none';
            emptyState.style.display = 'flex';
        } else {
            filledState.style.display = 'flex';
            emptyState.style.display = 'none';
        }

        const uploadToCloudinary = async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            try {
                const response = await axios.post(uploadUrl, formData);
                return response.data.secure_url; // Trả về URL của ảnh đã upload
            } catch (error) {
                console.error('Error uploading to Cloudinary:', error);
                throw new Error('Failed to upload image');
            }
        };

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
                
                // Kiểm tra xem còn ảnh nào không
                const remainingImages = Array.from(previewImages).filter(img => img.src && img.src !== '');
                if (remainingImages.length === 0) {
                    filledState.style.display = 'none';
                    emptyState.style.display = 'flex';
                }
            });
        });

        if (btns.length > 1) {
            btns[0].addEventListener('click', () => imageInputEmpty.click());
            btns[1].addEventListener('click', () => imageInputFilled.click());
        }

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

    render = async () => {
        // Lấy ID từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const id = window.location.pathname.split('/').pop();
        const product = await this.fetchProduct(id);
        product.div=product.status.toLowerCase().replace(/\s+/g, '-');
        console.log(product.div);
       
        if (!product) {
            document.querySelector(".content").innerHTML = "<p>Error loading product</p>";
            return;
        }

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
            ${productForm({ mode: 'edit', productData: product })}
        </div>`;

        document.querySelector(".content").innerHTML = content;

        this.dropdown('dropdown', 'dropdownButton', 'dropdownContent', 'status-text');
        this.dropdown('dropdowntop', 'dropdownButtonTop', 'dropdownContentTop');
        this.addimage();

        const saveBtn = document.querySelector("#addProduct");
        saveBtn.addEventListener("click", async () => {
            try {
                const images = Array.from(document.querySelectorAll(".preview-img"));
                const imageFiles = Array.from(document.querySelectorAll('input[type="file"]')).map(input => input.files[0]).filter(file => file);
                
                console.log("Current images:", images.map(img => img.src));
                console.log("New image files:", imageFiles);

                // Upload new images to Cloudinary
                const uploadedImages = await Promise.all(
                    imageFiles.map(file => this.uploadToCloudinary(file))
                );
                console.log("Uploaded images:", uploadedImages);

                // Prepare image URLs
                const imageUrls = {
                    firstImg: null,
                    secondImg: null,
                    thirdImg: null
                };

                let uploadedIndex = 0;

                // Handle each image
                for (let i = 0; i < images.length; i++) {
                    if (images[i]?.src) {
                        if (images[i].src.includes('cloudinary')) {
                            // If image is already from Cloudinary, keep it
                            imageUrls[`${i === 0 ? 'first' : i === 1 ? 'second' : 'third'}Img`] = images[i].src;
                        } else if (images[i].src.includes('data:image')) {
                            // If it's a new image (base64), use the next uploaded URL
                            if (uploadedIndex < uploadedImages.length) {
                                imageUrls[`${i === 0 ? 'first' : i === 1 ? 'second' : 'third'}Img`] = uploadedImages[uploadedIndex];
                                uploadedIndex++;
                            }
                        }
                    }
                }

                console.log("Final image URLs:", imageUrls);

                const formData = {
                    name: document.querySelector('input[name="productName"]').value,
                    description: document.querySelector('textarea[name="description"]').value,
                    price: document.querySelector('input[name="basePrice"]').value,
                    discount_type: document.querySelector('select[name="discountType"]').value,
                    discount_value: document.querySelector('input[name="discountPercentage"]').value,
                    tax_class: document.querySelector('select[name="taxClass"]').value,
                    vat_amount: document.querySelector('input[name="vatAmount"]').value,
                    sku: document.querySelector('input[name="sku"]').value,
                    barcode: document.querySelector('input[name="barcode"]').value,
                    quantity: document.querySelector('input[name="quantity"]').value,
                    category_id: document.querySelector('#dropdownButtonTop').textContent,
                    status: document.querySelector('#dropdownButton').textContent,
                    ImageSrc: imageUrls
                };

                const response = await axios.put(`https://67c09c48b9d02a9f224a690e.mockapi.io/api/product/${product.id}`, formData);
                console.log("Server response:", response.data);
                alert("Product updated successfully");
                window.location.href = "/";
            } catch (error) {
                console.error("Error updating product:", error);
                alert("Error updating product. Please try again.");
            }
        });

        const cancelBtn = document.querySelector(".product-title__buttons--cancel");
        cancelBtn.addEventListener("click", () => {
            console.log("Cancelled");
            window.location.href = "/";
        });
    };
}