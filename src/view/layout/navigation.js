import navigationItem from '../components/navigationItem';
import navigationItemDropdown from '../components/navigationItemDropDown';
import {subMenu, getTotalNotifications}  from '../components/submenu';

import {
    logo, dashboard, dashboardHover, shop, shopHover, down, downHover, check, checkHover,
    folder, folderHover, comment, commentHover, calendar, calendarHover,
    user, userHover
} from './../../assets/icon';

 
const menuItems = [
    { name: 'Product', notification: 3 },
    { name: 'Categories', notification: 5 },
    { name: 'Orders', notification: 0 },  
    { name: 'Customer', notification: 2 }
  ];
const subMenuItems = menuItems.map( item =>  subMenu(item.name,item.notification)).join('')
const totalNotifications =  getTotalNotifications()

const navigation = () => {
    return `
        <div class="navigation">
            <div class="navigation__container--logo">
               <div class="navigation__container--logo--wrapper">
                   <img src=${logo} alt="logo" />
                   <h1 class="navigation__container--name">Pixlab</h1>
               </div> 
            </div>       
            ${navigationItem(dashboard, dashboardHover, 'Dashboard')}
            ${navigationItemDropdown(shop, shopHover, 'E-Commerce', totalNotifications, down, downHover, 'ecommerceMenu')}
            <div class="subMenuContainer" id="subMenuContainer" style="display: none;">
                ${subMenuItems}
            </div>
            ${navigationItem(check, checkHover, 'Project')}
            ${navigationItemDropdown(user, userHover, 'Contact', 0, down, downHover)}
            ${navigationItem(folder, folderHover, 'File Manager')}
            ${navigationItem(comment, commentHover, 'Chat')}
            ${navigationItem(calendar, calendarHover, 'Calendar')}  
        </div>  
    `;
};

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

export default navigation;