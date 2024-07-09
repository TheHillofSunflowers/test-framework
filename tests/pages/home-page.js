class Homepage {
    open() {
        return browser.url('/');
    }

    get btnHome() {
        return $('#start');
    }

}

export default new Homepage();