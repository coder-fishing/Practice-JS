import { caretRight, download, add, caretLeft, checkbox, minus, caretDown } from "../../assets/icon";
import CategoryRow from "../components/categoryRow";  
import axios from "axios";

class CategoryListView {
    constructor() {
        this.categories = [];
        this.itemsPerPage = 8;
        this.currentPage = 1;
        this.searchQuery = '';
        this.render();

        this.init();
    }

    async fetchCategories() {
        try {
            const response = await axios.get('https://67c09c48b9d02a9f224a690e.mockapi.io/api/cate');
            this.categories = response.data;

            this.maxPage = Math.ceil(this.categories.length / this.itemsPerPage);
            this.render();
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    

    setupPaginationEvents() {
        document.querySelector("#prevbtn")?.addEventListener("click", () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.render();
            }
        });

        document.querySelector("#nextbtn")?.addEventListener("click", () => {
            if (this.currentPage < this.maxPage) {
                this.currentPage++;
                this.render();
            }
        });
    }

    getPaginatedCategories() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.categories.slice(start, end);
    }

    renderPagination() {
        const pageNumbersContainer = document.getElementById("page-numbers");
        if (!pageNumbersContainer) return;

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
                clik.classList.toggle('checkactive');
                checks[index].classList.toggle('rowactive');
            });
        });
    }

    clickTagItem = () => {
        const tags = document.querySelectorAll('.tag-add-searchbar__tag--item');
        tags.forEach(tag => {
            tag.addEventListener('click', () => {
                tags.forEach(t => t.classList.remove('item-active'));
                tag.classList.toggle('item-active');
            });
        });
    }

    async init() {
        document.addEventListener("DOMContentLoaded", async () => {
          await this.fetchCategories();
        });
      }

    render() {
        const paginatedCategories = this.getPaginatedCategories();

        const bin = `
            <div class="product-list">
                <div class="product-title">
                    <div class="product-title-left">
                        <p class="product-title-left__name">Categories</p>
                        <div class="product-title-left__breadcrumb">
                            <p class="product-title-left__breadcrumb--active">Dashboard</p>
                            <figure>
                                <img src="${caretRight}" alt="arrow right" class="product-title__icon" />
                            </figure>
                            <p class="product-title-left__breadcrumb--normal">Category List</p>
                        </div>
                    </div>

                    <div class="product-title__buttons">
                        <button class="product-title__buttons--download">
                            <img src="${download}" alt="icon" class="button__icon" />
                            <span class="button__text">Export</span>
                        </button>
                        <a href="addcategory">
                            <button class="product-title__buttons--add">
                                <img src="${add}" alt="icon" class="button__icon" />
                                <span class="button__text">Add Category</span>
                            </button>
                        </a>
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
                                        <p class="product-table-header__name translate">Category</p>  
                                    </div> 
                                    <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                                </div>
                            </th> 
                            <th class="product-table-header">
                                <div class="product-table-header__wrapper two">
                                    <p class="product-table-header__name">Sold</p>
                                    <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                                </div> 
                                
                            </th>
                            <th class="product-table-header">   
                                <div class="product-table-header__wrapper two">
                                    <p class="product-table-header__name">Stock</p>
                                    <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                                </div>
                            </th> 
                            <th class="product-table-header">
                                <div class="product-table-header__wrapper two">
                                    <div class="product-table-header__name">Added</div>
                                    <img src="${caretDown}" alt="arrow Down" class="product-title__icon" />
                                </div>
                            </th>
                            <th class="product-table-header">
                                <div class="product-table-header__wrapper">
                                    <p class="product-table-header__name">Action</p>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginatedCategories.map(category => CategoryRow({ category })).join('')}
                    </tbody>
                </table>

                <div class="pagination">
                    <div class="pagination__showing">
                        Showing ${(this.currentPage - 1) * this.itemsPerPage + 1}-${Math.min(this.currentPage * this.itemsPerPage, this.categories.length)} from ${this.categories.length}
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

export default CategoryListView;
