function navigationController() {
    document.addEventListener("DOMContentLoaded", () => {
        const ecommerceMenu = document.getElementById("ecommerceMenu");
        const subMenuContainer = document.getElementById("subMenuContainer");
    
        ecommerceMenu.addEventListener("click", (event) => {
            event.stopPropagation(); 
            const isVisible = subMenuContainer.style.display === "block";
    
            if (!isVisible) {
                ecommerceMenu.classList.add("active"); 
                subMenuContainer.style.display = "block";
            } else {
                ecommerceMenu.classList.remove("active");
                subMenuContainer.style.display = "none";
            }
        });
    
       
        subMenuContainer.addEventListener("mouseenter", () => {
            ecommerceMenu.classList.add("active");
        });
    
        subMenuContainer.addEventListener("mouseleave", () => {
            if (subMenuContainer.style.display !== "block") {
                ecommerceMenu.classList.remove("active");
            }
        });
    
        document.addEventListener("click", () => {
            subMenuContainer.style.display = "none";
            ecommerceMenu.classList.remove("active");
        });
    
        subMenuContainer.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    });
    
}

export default navigationController;