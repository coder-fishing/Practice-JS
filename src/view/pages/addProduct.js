import axios from "axios";
import productForm from "../components/productForm.js";
import {caretRight, cross, add} from "./../../assets/icon";
import { Product } from "./../../model/product.model.js";

// Cloudinary configuration
const cloudName = 'dzivajta9';
const uploadPreset = 'Practicejs_image';
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

class addProduct {
    constructor() {
        this.render();
        this.loadCategories();
        this.dropdown('dropdown', 'dropdownButton', 'dropdownContent', 'status-text');
        this.dropdown('dropdowntop', 'dropdownButtonTop', 'dropdownContentTop');
        this.hadleAddProduct();
        this.addimage();    
    }

    async loadCategories() {
        try {
            const response = await axios.get('https://67c09c48b9d02a9f224a690e.mockapi.io/api/cate');
            const categories = response.data;
            console.log("categories", categories);
            categories.map((category) => {
                console.log(category.categoryID)
            })
            
            const dropdownContent = document.getElementById('dropdownContentTop');
            if (dropdownContent) {
                dropdownContent.innerHTML = categories.map(category => `
                    <div data-value="${category.name}" 
                         data-id="${category.categoryID}">
                    ${category.name}</div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    dropdown = (id, btn, content, text = null) => {
        const dropdown = document.getElementById(id);
        const dropdownButton = document.getElementById(btn);
        const dropdownContent = document.getElementById(content);
        const statusText = text ? document.getElementById(text) : null;
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
    }

    

    addimage = () => {        
        const emptyState = document.getElementById('emptyState');
        const filledState = document.getElementById('filledState');
        const imageInputEmpty = document.getElementById('imageInputEmpty');
        const imageInputFilled = document.getElementById('imageInputFilled');
        const btns = document.querySelectorAll('.media__upload-btn');
        const previewImages = document.querySelectorAll('.preview-img');
        const frames = document.querySelectorAll('.list-image-preview');

        let currentImages = [];
        filledState.style.display = 'none';

        if (btns.length > 1) {
            btns[0].addEventListener('click', () => imageInputEmpty.click());
            btns[1].addEventListener('click', () => imageInputFilled.click());
        }

        // Hàm upload ảnh lên Cloudinary
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

        async function handleImageUpload(event) {
            const files = event.target.files;
            
            if (files.length > 0) {
                try {
                    const newFiles = Array.from(files);
                    
                    // Giới hạn số lượng ảnh
                    if (currentImages.length + newFiles.length > 3) {
                        alert('Maximum 3 images allowed');
                        return;
                    }

                    // Upload từng ảnh lên Cloudinary
                    for (const file of newFiles) {
                        // Kiểm tra định dạng file
                        if (!file.type.startsWith('image/')) {
                            alert('Please upload only image files');
                            continue;
                        }
                        
                        try {
                            const imageUrl = await uploadToCloudinary(file);
                            currentImages.push(imageUrl);
                        } catch (error) {
                            alert('Error uploading image. Please try again.');
                            console.error('Upload error:', error);
                            continue;
                        }
                    }

                    // Cập nhật giao diện
                    emptyState.style.display = 'none';
                    filledState.style.display = 'flex';

                    previewImages.forEach((img, index) => {
                        if (index < currentImages.length) {
                            frames[index].style.display = 'block';
                            img.src = currentImages[index];
                        }
                    });
                } catch (error) {
                    console.error('Error handling images:', error);
                    alert('Error uploading images. Please try again.');
                }
            }
        }

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

        imageInputEmpty.addEventListener('change', handleImageUpload);
        imageInputFilled.addEventListener('change', handleImageUpload);
    }
 
    hadleAddProduct = () => {
        const dropdownContent = document.getElementById('dropdownContent');
        const statusText = document.getElementById('status-text');
        const dropdownButton = document.getElementById('dropdownButton');
        const items = dropdownContent.querySelectorAll('div');
        const addProduct = document.querySelector('#addProduct');
        
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                const selectedValue = e.target.getAttribute('data-value');
                dropdownButton.textContent = selectedValue;
                
            });
        });

        let selectedCategory = "None";

        document.getElementById("dropdownContentTop").addEventListener("click", (event) => {
            const selectedValue = event.target.getAttribute("data-value"); 
            const selectedId = event.target.getAttribute("data-id");
            console.log("selectedId", selectedId);
            if (selectedValue) {
                selectedCategory = selectedValue;
                const dropdownButton = document.getElementById("dropdownButtonTop")
                dropdownButton.textContent = selectedCategory;
                dropdownButton.setAttribute("data-selected-id", selectedId);
                
            }
        });

        const getProductData = () => { 
            const images = Array.from(document.querySelectorAll(".preview-img"));   
            const dropdownButton = document.getElementById("dropdownButtonTop");
            const categoryId = dropdownButton ? dropdownButton.getAttribute("data-selected-id") : null;
            console.log(categoryId);
            return {
                name: document.querySelector('input[name="productName"]').value.trim(),
                sku: document.querySelector('input[name="sku"]').value.trim(),
                category: selectedCategory,
                categoryId: categoryId,
                price: document.querySelector('input[name="basePrice"]').value.trim(),
                status: statusText.textContent.trim(),
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

        const validateProductData = (data) => {
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
       
        addProduct.addEventListener('click', async() => {
            const bin = getProductData();
            
            if (!validateProductData(bin)) {
                return;
            }

            var item = new Product(
                '', // id
                bin.name,
                bin.sku,
                bin.category,
                bin.categoryId,
                bin.price,
                bin.status,
                bin.added,
                bin.description,
                bin.ImageSrc.firstImg,
                bin.ImageSrc.secondImg,
                bin.ImageSrc.thirdImg,
                '', // discountType
                '', // discountValue
                '', // taxClass
                '', // vatAmount
                '', // barcode
                bin.stock
            );

            console.log("Product data being sent:", item);
            
            try {
                const response = await axios.post(`https://67c09c48b9d02a9f224a690e.mockapi.io/api/product`, item);
                console.log("Server response:", response.data);
                alert("Product added successfully");
                // window.location.href = "/";
            } catch(error) {
                console.error("Error adding product:", error);
                alert("Error adding product. Please try again.");
            }
        }); 
    }

    render() {
        const content = `
         <div class="product-list">
            <div class="product-title">
              <div class="product-title-left">
                <p class="product-title-left__name">Product</p>
                <div class="product-title-left__breadcrumb">
                  <a href=/dashboard ><p class="product-title-left__breadcrumb--active">Dashboard</p></a>
                  <figure>
                    <img src="${caretRight}" alt="arrow right" class="product-title__icon" />
                  </figure>
                 <a href=/> <p class="product-title-left__breadcrumb--active">Product List</p></a>
                  <figure>
                    <img src="${caretRight}" alt="arrow right" class="product-title__icon" />
                  </figure>
                  <p class="product-title-left__breadcrumb--normal">Add Product</p>
                </div>   
              </div>
              <div class="product-title__buttons">  
                <button class="product-title__buttons--cancel">
                    <figure class="button__icon">
                        <img src="${cross}" alt="icon"/>
                    </figure>
                  <span class="button__text">Cancel</span>
                </button>
            
                <button class="product-title__buttons--add" id="addProduct">
                    <figure class="button__icon">
                        <img src="${add}" alt="icon"  />
                    </figure>
                    <span class="button__text">Add product</span>
                </button>
              </div>
            </div>
         ${productForm({ mode: 'create'})}`
        document.querySelector(".content").innerHTML = content;
    }
}

export default addProduct;
