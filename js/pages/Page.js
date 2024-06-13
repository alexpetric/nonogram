export default class Page {
    constructor({key, title}) {
        this.key = key;
        this.title = title;
        this.pageElement = document.getElementById('content');
    }

    render() {
        return ``;
    }

    showPage() {
        this.pageElement.innerHTML = this.render();
        document.title = this.title;
    }

    hidePage() {
        this.pageElement.innerHTML = '';
    }
}