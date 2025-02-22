function navigationController() {
    document.addEventListener("DOMContentLoaded", () => {
        const ecommerceMenu = document.getElementById("ecommerceMenu");
        const subMenuContainer = document.getElementById("subMenuContainer");
    
        // Khi nhấn vào "E-Commerce"
        ecommerceMenu.addEventListener("click", (event) => {
            event.stopPropagation(); // Ngăn sự kiện lan ra ngoài
            const isVisible = subMenuContainer.style.display === "block";
    
            if (!isVisible) {
                ecommerceMenu.classList.add("active"); // Giữ trạng thái active
                subMenuContainer.style.display = "block";
            } else {
                ecommerceMenu.classList.remove("active");
                subMenuContainer.style.display = "none";
            }
        });
    
        // Giữ trạng thái hover khi di chuột vào submenu
        subMenuContainer.addEventListener("mouseenter", () => {
            ecommerceMenu.classList.add("active");
        });
    
        subMenuContainer.addEventListener("mouseleave", () => {
            if (subMenuContainer.style.display !== "block") {
                ecommerceMenu.classList.remove("active");
            }
        });
    
        // Ẩn submenu nếu nhấn ra ngoài
        document.addEventListener("click", () => {
            subMenuContainer.style.display = "none";
            ecommerceMenu.classList.remove("active");
        });
    
        // Ngăn submenu bị ẩn khi click vào bên trong
        subMenuContainer.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    });
    
}

export default navigationController;