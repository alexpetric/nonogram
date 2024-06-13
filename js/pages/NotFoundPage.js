import Page from "./Page.js";

export default class NotFoundPage extends Page {
    constructor(settings) {
        super(settings);
    }

    render() {
        return `
            <section id="not-found">
                <h1>404 - Page Not Found</h1>
            </section>
        `;
    }
}