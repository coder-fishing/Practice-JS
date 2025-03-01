import { eye, trash, pencil, checkbox ,checkicon , noAvt} from "../../assets/icon/index.js";
const ProductRow = ({ product }) => {
  return (`
      <tr class="product-table__row">
          <td class="product-table__item"> 
            <div class="product-table__name">
                <div class="product-table__name__checkbox">
                      <img src="${checkbox}" alt="checkbox" class="product-table__name__checkbox--box"/>
                      <img src="${checkicon}" alr="check" class="product-table__name__checkbox--check"/>
                  </div>  
                  <div  class="product-table__container">
                      <figure class="product-table__container--image">
                          <img src="${noAvt}" alt="product image"/>
                      </figure> 
                      <div class="product-table__container--decs">
                          <p class="product-table__container--decs--name">${product.name}</p>
                          <p class="product-table__container--decs--variants">${product.variants}</p>
                      </div> 
                  </div> 
            </div>     
         </td>  

          <td class="product-table__item">
                <div class="product-table__item--sku">${product.sku}</div>
          </td>
          <td class="product-table__item">
                <div class="product-table__item--categories">${product.category}</div>
          </td>
          <td class="product-table__item">
                <div class="product-table__item--stock">${product.stock}</div>
          </td> 
          <td class="product-table__item">
                <div class="product-table__item--price">${product.price}</div>
          </td> 
          <td class="product-table__item ">
                <div class="product-table__item--status">
                    <div class="product-table__item--status-${product.status.replace(/\s+/g, '-').toLowerCase()}">
                        <p class="product-table__item--status-${product.status.replace(/\s+/g, '-').toLowerCase()}-text">${product.status}</p>
                   </div>
                </div> 
          </td>  
          <td class="product-table__item">
                <div class="product-table__item--added">${product.added}</div>
          </td>
          <td class="product-table__item">
              <div class="product-table__item--buttons">
                  <span class="product-table__edit">
                       <img src="${pencil}"/> 
                  </span>
                  <span class="product-table__view">
                        <img src="${eye}"/>
                  </span>
                  <span class="product-table__delete">
                        <img src="${trash}"/>
                  </span> 
          </td>
      </tr>
  `);
};


export default ProductRow;