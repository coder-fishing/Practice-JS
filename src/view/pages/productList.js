import { caretRight, download, add, caretLeft, checkbox, minus, caretDown } from "./../../assets/icon";
import searchBar from "./../components/searchBar";
import ProductRow from "./../components/productRow";  
import axios from "axios";

class ProductListView {

    constructor(products = []) {
      this.products = [];
      this.currentPage = 1;
      this.itemsPerPage = 6;
      this.maxPage = 1; 
  
      this.init();
    }

  async fetchProducts() {
    try {
      const response = await axios.get("https://67c09c48b9d02a9f224a690e.mockapi.io/api/product");
      let products = response.data;

      this.products = products

      this.maxPage = Math.ceil(this.products.length / this.itemsPerPage); 
      this.render(); 
    } catch (error) {
      console.error("Error fetching products:", error);
      // this.products = Array.from({ length: 50 }, (_, i) => ({
      //   id: i + 1,
      //   name: `Product ${i + 1}`,
      //   price: (i + 1) * 10,
      //   status: i % 4 === 0
      //     ? "Low Stock"
      //     : i % 4 === 1
      //     ? "Out of Stock"
      //     : i % 4 === 2
      //     ? "Draft"
      //     : "Published"
      // }));

      this.maxPage = Math.ceil(this.products.length / this.itemsPerPage);
      this.render();
    }
  }

  async init() {
    document.addEventListener("DOMContentLoaded", async () => {
      await this.fetchProducts();
    });
  }

  setupPaginationEvents() {
    document.querySelector("#prevbtn").addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.render();
      } 
    });

    document.querySelector("#nextbtn").addEventListener("click", () => {
      if (this.currentPage < this.maxPage) {
        this.currentPage++;
        this.render();
      }
    });
  }

  getPaginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.products.slice(start, end);
  }

  renderPagination() {
    const pageNumbersContainer = document.getElementById("page-numbers");
    pageNumbersContainer.innerHTML = "";

    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.maxPage, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      const button = document.createElement("button");
      button.classList.add("page-btn");
      if (i === this.currentPage) button.classList.add("active");
      button.textContent = i;
      button.addEventListener("click", () => {
        this.currentPage = i;
        this.render();
      });
      pageNumbersContainer.appendChild(button);
    }

    if (endPage < this.maxPage) {
      const dots = document.createElement("div");
      dots.textContent = "...";
      dots.classList.add("dots");
      pageNumbersContainer.appendChild(dots);
    }
  }

  clickTable = () => {
    const cliks = document.querySelectorAll('.product-table__name__checkbox--check');
    const checks = document.querySelectorAll(".product-table__row");

    cliks.forEach((clik, index) => {
      clik.addEventListener('click', () => {
        clik.classList.toggle('checkactive'); // Toggle class checkactive cho phần tử được nhấp
        checks[index].classList.toggle('rowactive'); // Toggle class rowactive cho hàng tương ứng
        //toggle thêm nếu chưa có hủy nếu có else
      }); 
    });
  } 

  clickTagItem = () => {
    const tags = document.querySelectorAll('.tag-add-searchbar__tag--item');
    tags.forEach(tag => {
      tag.addEventListener('click', () => {
        tags.forEach(t => t.classList.remove('item-active'));
        tag.classList.toggle('item-active');
        console.log('hehe');
      });
    });
  };
  
  render() {
    this.maxPage = Math.ceil(this.products.length / this.itemsPerPage) || 1;
    const paginatedProducts = this.getPaginatedProducts();

    const bin = `
      <div class="product-list">
        <div class="product-title">
          <div class="product-title-left">
            <p class="product-title-left__name">Product</p>
            <div class="product-title-left__breadcrumb">
              <p class="product-title-left__breadcrumb--active">Dashboard</p>
              <figure>
                <img src="${caretRight}" alt="arrow right" class="product-title__icon" />
              </figure>
              <p class="product-title-left__breadcrumb--normal">Product List</p>
            </div>
          </div>
          <div class="product-title__buttons">
            <button class="product-title__buttons--download">
              <img src="${download}" alt="icon" class="button__icon" />
              <span class="button__text">Export</span>
            </button>
            <a href="addproduct">
              <button class="product-title__buttons--add">
                <img src="${add}" alt="icon" class="button__icon" />
                <span class="button__text">Add product</span>
              </button>
            </a>
          </div>
        </div>
 
        <div class="tag-add-searchbar"> 
          <div class="tag-add-searchbar__tag">
            <div class="tag-add-searchbar__tag--item">
              <span class="tag-add-searchbar__tag--item-element ">All Products</span>
            </div>
            <div class="tag-add-searchbar__tag--item ">
              <span class="tag-add-searchbar__tag--item-element">Published</span>
            </div> 
            <div class="tag-add-searchbar__tag--item ">
              <span class="tag-add-searchbar__tag--item-element">Low Stock</span>
            </div>
           <div class="tag-add-searchbar__tag--item">
              <span class="tag-add-searchbar__tag--item-element">Draft</span>
            </div>
          </div>
          <div class="tag-add-searchbar__search">
            ${searchBar("Search product. . .")}
          </div>
        </div>

        <table class="product-table">
          <thead>
          <tr>
            <th class="product-table-header">
              <div class="product-table-header__wrapper three">
              <div class="product-table-header__image">
                  <div class="product-table-header__imageleft">
                      <img class="product-table-header__imageleft--first" src="${checkbox}" alt="checkbox"/>
                      <img class="product-table-header__imageleft--second" src="${minus}" alt="tick/">
                  </div>
                  <p class="product-table-header__name translate">Product</p>  
              </div> 
              <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                    </div>
                </th> 
        
                <th class="product-table-header">
                    <div class="product-table-header__wrapper"><p class="product-table-header__name">SKU</p></div>
                </th>
        
                <th class="product-table-header">   
                    <div class="product-table-header__wrapper"><p class="product-table-header__name">Category</p></div>
                </th> 
              
                <th class="product-table-header">
                   <div class="product-table-header__wrapper two">
              <div class="product-table-header__name">Stock</div>
              <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                   </div>
                </th>
         
                <th  class="product-table-header">
                    <div class="product-table-header__wrapper two">
              <div class="product-table-header__name">Price</div>
              <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                    </div>
                </th> 
        
                <th class="product-table-header">
                    <div class="product-table-header__wrapper two">
              <p class="product-table-header__name">Status</p>
              <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                    </div>
                </th>
        
                <th class="product-table-header">
                    <div class="product-table-header__wrapper two">
              <p class="product-table-header__name">Added</p>
              <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                    </div>
                </th>
        
                <th class="product-table-header">
                   <div class="product-table-header__wrapper"> <p class="product-table-header__name">Action</p></div>
                </th>
            </tr>
          </thead>
          <tbody>
            ${paginatedProducts.map(product => ProductRow({ product })).join('')}
          </tbody>
        </table>

        <div class="pagination">
          <div class="pagination__showing">
            Showing ${(this.currentPage - 1) * this.itemsPerPage + 1}-${Math.min(this.currentPage * this.itemsPerPage, this.products.length)} from ${this.products.length}
          </div>
          <div class="pagination__button">
            <div class="pagination__button-caret-left" id="prevbtn">
              <figure class="image"><img src="${caretLeft}" alt="caret left" /></figure>
            </div>
            <div class="pagination__button-page-number" id="page-numbers"></div>
            <div class="pagination__button-caret-right" id="nextbtn">
              <figure class="image"><img src="${caretLeft}" alt="caret right" /></figure>
            </div>
          </div>
        </div>
      </div>
    `;

    document.querySelector("#content").innerHTML = bin;
    this.renderPagination(); 
    this.setupPaginationEvents();
    this.clickTable();
    this.clickTagItem();
  }
}

export default ProductListView;
