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


export default navigation;