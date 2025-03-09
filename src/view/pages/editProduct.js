export class DashboardView {
    constructor() {
      this.render();
    }
    render() {
      document.querySelector(".content").innerHTML = `<div><h1>Hello, Dashboard!</h1></div>`;
    }
}