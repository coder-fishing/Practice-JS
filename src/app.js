import navigation from './view/layout/navigation.js';
import mainRight from './view/layout/mainRight.js';
import navigationController from './controller/navigationController.js';

const app = () => {
    return `
        <div class="container">
            ${navigation()}
            ${mainRight()}
        </div>
    `;
}
    
        document.querySelector('.root').innerHTML = app();
        navigationController();

export default app;