import productForm from "../components/productForm.js";
import {caretRight, cross, add} from "./../../assets/icon";
class addProduct {
    constructor() {
        this.render();
        this.dropdown('dropdown', 'dropdownButton', 'dropdownContent', 'status-text');
        this.dropdown('dropdowntop', 'dropdownButtonTop', 'dropdownContentTop');
        this.addimage();
        this.hadleAddProduct();
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
            if (!dropdown==(e.target)) {
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

        // Ẩn filledState ban đầu
        filledState.style.display = 'none';

        // Gán sự kiện cho nút "Add Image"
        if (btns.length > 1) {
            btns[0].addEventListener('click', () => imageInputEmpty.click());
            btns[1].addEventListener('click', () => imageInputFilled.click());
        }

        function handleImageUpload(event, hideState, showState) {
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

        imageInputEmpty.addEventListener('change', (event) => handleImageUpload(event, 'emptyState', 'filledState'));
        imageInputFilled.addEventListener('change', (event) => handleImageUpload(event, 'emptyState', 'filledState'));
    }
 
    hadleAddProduct = () => {
        const dropdownContent = document.getElementById('dropdownContent');
        const statusText =document.getElementById('status-text')
        const items = dropdownContent.querySelectorAll('div');
        const addProduct = document.querySelector('#addProduct');
        
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                const selectedValue = e.target.getAttribute('data-value');
                dropdownButton.textContent = selectedValue;
            });
        });

        let selectedCategory = "None";

        // Lắng nghe sự kiện click để cập nhật giá trị category
        document.getElementById("dropdownContentTop").addEventListener("click", (event) => {
            const selectedValue = event.target.getAttribute("data-value"); 
            if (selectedValue) {
                selectedCategory = selectedValue; // Cập nhật giá trị
                document.getElementById("dropdownButtonTop").textContent = selectedCategory; // Cập nhật UI
            }
        });

        const getProductData = () => { 
            const images = Array.from(document.querySelectorAll(".preview-img"));                      
            return {
                sku: document.querySelector('input[name="sku"]').value.trim(),
                productName: document.querySelector('input[name="productName"]').value.trim(),
                ImageSrc: {
                        firstImg: images.length > 0 ? images[0].src : null,
                        secondImg: images.length > 1 ? images[1].src : null,
                        thirdImg: images.length > 2 ? images[2].src : null,
                    },
                price: document.querySelector('input[name="basePrice"]').value.trim(),
                imageCount: document.querySelectorAll(".preview-img").length,
                status: statusText.textContent.trim(),
                category: selectedCategory 
            };
        };

       
        addProduct.addEventListener('click', () => {
            const { sku, productName, ImageSrc, imageCount,price ,status,category} = getProductData();
            console.log("SKU:", sku);
            console.log("Product Name:", productName);
            console.log("Image:",'firstimg', ImageSrc.firstImg , 'secondimg', ImageSrc.secondImg, 'thirdimg', ImageSrc.thirdImg);
            console.log("Image Count:", imageCount);
            console.log("Status:", status);
            console.log("Price:", price);
            console.log("Category:", category);
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
         ${productForm()}`
        document.querySelector(".content").innerHTML = content;
    }
}

export default addProduct;
