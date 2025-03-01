import {
    caretRight,
    download,
    add,
    caretDown,
    checkbox,
    caretLeft,
    minus,
} from '../../assets/icon/index.js';
import searchBar from '../components/searchBar.js';
import ProductRow from '../components/productRow.js';

const products = Array.from({ length: 10 }, (_, i) => ({
    name: `Product ${i + 1}`,
    sku: `SKU00${i + 1}`,
    category: `Category ${(i % 3) + 1}`,
    stock: Math.floor(Math.random() * 50),
    price: Math.floor(Math.random() * 500) + 50,
    status: ['published', 'low-stock', 'draft', 'out of stock'][i % 4],
    added: `2025-02-${String(20 + i).padStart(2, '0')}`,
}));

document.addEventListener("DOMContentLoaded", function () {
    const prevBtn = document.querySelector('#prevbtn');
    const nextBtn = document.querySelector('#nextbtn');
    const pageNumbersContainer = document.getElementById('page-numbers');
    let currentPage = 1;
    const maxPage = 10;

    function renderPagination() {
        pageNumbersContainer.innerHTML = '';
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(maxPage, startPage + 4);

        for (let i = startPage; i <= endPage; i++) {
            createPageButton(i);
        } 

        if (endPage < maxPage) {
            const dots = document.createElement('div');
            dots.textContent = '...';
            dots.classList.add('dots');
            pageNumbersContainer.appendChild(dots);
        }
    }
    function createPageButton(page) {
        const button = document.createElement('button');
        button.classList.add('page-btn');
        if (page === currentPage) button.classList.add('active');
        button.textContent = page;
        button.addEventListener('click', () => {
            currentPage = page;
            renderPagination();
        });
        pageNumbersContainer.appendChild(button);
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPagination();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < maxPage) {
            currentPage++;
            renderPagination();
        }
    });

    renderPagination();
});

function productList() {
    return `   
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
                    <button class="product-title__buttons--add">
                        <img src="${add}" alt="icon" class="button__icon" />
                        <span class="button__text">Add product</span>
                    </button> 
                </div>  
            </div>  
      
            <div class="tag-add-searchbar">   
                <div class="tag-add-searchbar__tag">  
                    <div class="tag-add-searchbar__tag--item">
                        <span class="tag-add-searchbar__tag--item-element">All Products</span>
                     </div>
                     <div class="tag-add-searchbar__tag--item">
                        <span class="tag-add-searchbar__tag--item-element">Published</span>
                     </div> 
                     <div class="tag-add-searchbar__tag--item tag-add-searchbar__tag--item--active">
                        <span class="tag-add-searchbar__tag--item-element">Low Stock</span>
                     </div>
                     <div class="tag-add-searchbar__tag--item">
                        <span class="tag-add-searchbar__tag--item-element">Draft</span>
                     </div>
                </div> 
                <div class="tag-add-searchbar__search">
                     ${searchBar('Search product. . .')}  
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
                         ${products.map((product) => ProductRow({ product })).join('')}
                </tbody>  
            </table> 
            <div>
                <div class="pagination">
                    <div class="pagination__showing" ">
                        Showing 1-10 from 100
                    </div>
                    <div class="pagination__button" >            
                        <div class="pagination__button-caret-left" id="prevbtn">
                            <figure class="image"><img src="${caretLeft}" alt="caret left"  /></figure>
                        </div>  
                        <div class="pagination__button-page-number" id="page-numbers"> 
                            <div class="page-btn">1</div>
                            <div class="page-btn">2</div>
                            <div class="page-btn">3</div>
                            <div class="page-btn">4</div>
                            <div class="page-btn">5</div>
                            <div class="dots">...</div> 
                        </div>
                            <div class="pagination__button-caret-right" id="nextbtn">
                                <figure class="image"><img src="${caretLeft}" alt="caret right" /></figure>
                            </div> 
                        </div>      
                    </div> 
                </div>
        </div> 
    `;
}

export default productList;