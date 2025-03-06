import  Layout  from "./../view/layout";

export class Router {
    constructor(routes) {
        // Define routes with path and controller (view function)
        this.routes = routes     
        this.contentDiv = document.getElementById('content');
        this.loadInitialRoute();
        window.addEventListener('popstate', () => this.loadRoute());
    }


    loadInitialRoute() {
        this.loadRoute(location.pathname);
    } 

    navigate(path) {
        history.pushState({}, '', path);
        this.loadRoute(path); 
    }