import  ProductListView  from './view/pages/productList'
import categoriesList from './view/pages/categoriesList.js'
import { CategoryController } from './controller/categories.controller.js'
import { ProductController } from './controller/product.controller.js'
import { Router } from './router'
import { DashboardController } from './controller/dashboard.controller'
import { editProduct } from './view/pages/editProduct'
import addProduct from './view/pages/addProduct.js'

const routes = [
    { path: '/product', ccontroller:ProductController,view:ProductListView },
    { path:'/', controller:DashboardController , view:ProductListView  },
    { path:'/editproduct/:id', controller:ProductController , view:editProduct  },
    { path:'/category' , controller:CategoryController, view:categoriesList},
    { path: '/addproduct', controller:ProductController, view:addProduct}
]   

new Router(routes)