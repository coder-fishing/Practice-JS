import productForm from "../components/productForm.js";
import axios from "axios";
import { caretRight, cross, save } from "./../../assets/icon";

export class editProduct {
    constructor() {
        this.render(); 
    }

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

        let currentImages = [];

        filledState.style.display = 'none';

        if (btns.length > 1) {
            btns[0].addEventListener('click', () => imageInputEmpty.click());
            btns[1].addEventListener('click', () => imageInputFilled.click());
        }

        function handleImageUpload(event) {
            const files = event.target.files;

            if (files.length > 0) {
                const newFiles = Array.from(files);
                currentImages = [...currentImages, ...newFiles];

                emptyState.style.display = 'none';
                filledState.style.display = 'flex';

                previewImages.forEach((img, index) => {
                    if (index < currentImages.length) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            frames[index].style.display = 'block';
                            img.src = e.target.result;
                        };
                        reader.readAsDataURL(currentImages[index]);
                    }
                });
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
                status: document.querySelector('#dropdownButton').textContent
            };
            try {
                await axios.put(`https://67c09c48b9d02a9f224a690e.mockapi.io/api/product/${product.id}`, formData);
                console.log("Product updated:", formData);
            } catch (error) {
                console.error("Error updating product:", error);
            }
        });

        const cancelBtn = document.querySelector(".product-title__buttons--cancel");
        cancelBtn.addEventListener("click", () => {
            console.log("Cancelled");
            // Logic hủy, ví dụ quay lại danh sách
        });
    };
}