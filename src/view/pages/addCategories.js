import productForm from "../components/productForm";

class addCategories {  
    constructor(){
        this.render();
    }

    render(){
        const content = productForm();
        console.log("content");
        document.querySelector(".content").innerHTML = content;
    }
}

export default addCategories; 