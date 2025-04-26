import { caretRight, download, add, caretLeft, checkbox, minus, caretDown } from "./../../assets/icon";
import CategoryRow from "./../components/categoryRow";  
import axios from "axios";
import { setupPaginationEvents } from "../../utils/setupPaginationEvents.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { createToast } from "../../utils/toast.js";

class CategoryListView {
    constructor() {
        this.categories = [];
        this.itemsPerPage = 8;
        this.currentPage = 1;
        this.searchQuery = '';
        this.API_URL = 'https://67c09c48b9d02a9f224a690e.mockapi.io/api';
        this.selectedCategories = new Set();
        this.render();
        this.init();
    }

    async fetchCategories() {
        try {
            showLoading();
            const response = await axios.get(`${this.API_URL}/cate`);
            this.categories = response.data;
            this.maxPage = Math.ceil(this.categories.length / this.itemsPerPage);
            this.render();
            createToast('Categories loaded successfully', 'success');
        } catch (error) {
            console.error('Error fetching categories:', error);
            createToast('Failed to load categories', 'error');
        } finally {
            hideLoading();
        }
    }

    async init() {
        await this.fetchCategories();
        this.setupDeleteHandlers();
        this.setupBulkActions();
    }

    setupBulkActions() {
        document.addEventListener('click', (e) => {
            const headerCheckbox = e.target.closest('.product-table-header__imageleft--first');
            if (headerCheckbox) {
                const allCheckboxes = document.querySelectorAll('.product-table__name__checkbox--check');
                const allRows = document.querySelectorAll('.product-table__row');
                
                const isHeaderChecked = headerCheckbox.classList.contains('checked');
                headerCheckbox.classList.toggle('checked');
                
                allCheckboxes.forEach((checkbox, index) => {
                    if (!isHeaderChecked) {
                        checkbox.classList.add('checkactive');
                        allRows[index].classList.add('rowactive');
                        const categoryId = allRows[index].getAttribute('data-id');
                        if (categoryId) this.selectedCategories.add(categoryId);
                    } else {
                        checkbox.classList.remove('checkactive');
                        allRows[index].classList.remove('rowactive');
                        const categoryId = allRows[index].getAttribute('data-id');
                        if (categoryId) this.selectedCategories.delete(categoryId);
                    }
                });
            }
        });
    }

    async handleBulkDelete() {
        if (this.selectedCategories.size === 0) return;

        if (confirm(`Are you sure you want to delete ${this.selectedCategories.size} selected categories?`)) {
            try {
                showLoading();
                const deletePromises = Array.from(this.selectedCategories).map(id => 
                    axios.delete(`${this.API_URL}/cate/${id}`)
                );
                await Promise.all(deletePromises);
                this.categories = this.categories.filter(c => !this.selectedCategories.has(c.categoryID));
                this.selectedCategories.clear();
                this.renderTableOnly();
                createToast('Selected categories deleted successfully', 'success');
            } catch (error) {
                console.error('Error deleting categories:', error);
                createToast('Failed to delete some categories', 'error');
            } finally {
                hideLoading();
            }
        }
    }

    setupDeleteHandlers() {
        document.addEventListener('click', async (e) => {
            const deleteButton = e.target.closest('.product-table__delete');
            if (deleteButton) {
                const row = deleteButton.closest('tr');
                const categoryId = row.getAttribute('data-id');
                
                if (this.selectedCategories.size > 0) {
                    this.handleBulkDelete();
                } else if (categoryId) {
                    if (confirm('Are you sure you want to delete this category?')) {
                        try {
                            showLoading();
                            await axios.delete(`${this.API_URL}/cate/${categoryId}`);
                            this.categories = this.categories.filter(c => c.categoryID !== categoryId);
                            this.renderTableOnly();
                            createToast('Category deleted successfully', 'success');
                        } catch (error) {
                            console.error('Error deleting category:', error);
                            createToast('Failed to delete category', 'error');
                        } finally {
                            hideLoading();
                        }
                    }
                }
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
        const checkboxes = document.querySelectorAll('.product-table__name__checkbox--check');
        const rows = document.querySelectorAll(".product-table__row");

        checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('click', () => {
                checkbox.classList.toggle('checkactive');
                rows[index].classList.toggle('rowactive');
                
                const categoryId = rows[index].getAttribute('data-id');
                if (categoryId) {
                    if (checkbox.classList.contains('checkactive')) {
                        this.selectedCategories.add(categoryId);
                    } else {
                        this.selectedCategories.delete(categoryId);
                    }
                }
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

    renderTableOnly() {
        const paginatedCategories = this.getPaginatedCategories();
        const tableBody = document.querySelector('.product-table tbody');
        if (tableBody) {
            tableBody.innerHTML = paginatedCategories.map(category => CategoryRow({ category })).join('');
            this.clickTable();
        }
        this.renderPagination();
    }

    render() {
        const paginatedCategories = this.getPaginatedCategories();

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
                                            <img class="product-table-header__imageleft--second" src="${minus}" alt="tick"/>
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

        document.querySelector("#content").innerHTML = content;
        this.renderPagination();
        setupPaginationEvents();
        this.clickTable();
        this.clickTagItem();
    }
}

export default CategoryListView;
