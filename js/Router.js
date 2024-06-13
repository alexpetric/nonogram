export default class Router {
    constructor({pages, defaultPage}) {
        this.pages = pages;
        this.defaultPage = defaultPage;
        this.currentPage = null;

        // first run
        this.route(window.location.href);

        // listen on url changes from user clicking back button
        window.addEventListener('popstate', e => {
            this.route(window.location.href);
        });

        // listen on url changes from user clicks
        window.addEventListener('click', e => {
            const element = e.target
            if (element.nodeName === 'A') {
                e.preventDefault();
                this.route(element.href);
                window.history.pushState(null, null, element.href)
            }
        });
    }

    route(urlString) {
        const url = new URL(urlString)
        const page = url.searchParams.get('page')

        if (this.currentPage) {
            this.currentPage.hidePage();
        }

        const pageInstanceMatched = this.pages.find(p => p.key === (page ?? this.defaultPage));
        this.currentPage = pageInstanceMatched ?? this.pages.find(p => p.key === '404');
        this.currentPage.showPage();
    }
}