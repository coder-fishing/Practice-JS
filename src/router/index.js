import addCategories from "./../view/pages/addCategories";
import addProducts from "./../view/pages/addProduct";
import products from "./../view/pages/productList";
import categories from "./../view/pages/categoriesList";
import editProduct from "./../view/pages/editProduct";
import editCategories from "./../view/pages/editCategories";

const rederContent = (contentDiv, contentFunction) => {
     contentDiv.innerHTML = `${contentFunction()}`;
}

// const navLinks = document.querySelectorAll('nav a');
const contentDiv = document.getElementById('content');

const routes = {
    '#addCategories': addCategories,
    '#addProducts': addProducts,
    '#categories': categories,
    '#editProduct': editProduct,
    '#products': products,
    '#editCategories': editCategories,
}

async function loadContent(url) {
    if (url) {
        try {
            const response = await fetch(url);
            const data = await response.text();
            contentDiv.innerHTML = data;
        } catch (error) {
            contentDiv.innerHTML = '<h2>Page Not Found</h2><p>Trang không tồn tại.</p>';
        }
    }
}

async function renderRouteContent() {
    let hash = window.location.hash || '#products';
    let contentFunction = routes[hash];

    if (contentFunction) {
        rederContent(contentDiv, contentFunction);
    } else {
        await loadContent(hash);
    }

    // Cập nhật class 'active' cho liên kết tương ứng
    // navLinks.forEach(link => {
    //     link.classList.remove('active');
    //     if (link.getAttribute('href') === hash) {
    //         link.classList.add('active');
    //     }
    // });
}
window.addEventListener('hashchange', renderRouteContent);
window.onload = renderRouteContent;