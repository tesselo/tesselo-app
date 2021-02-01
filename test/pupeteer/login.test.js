const puppeteer = require('puppeteer');

describe("login", () => {
    let browser = null;
    let page = null;
    let api_url = null;

    // Determine url to use.
    const stage = process.env.STAGE
    if ( stage == 'dev' || stage == 'staging') {
      api_url = 'https://' + stage + 'app.tesselo.com/login'
    } else if (stage == 'localhost') {
      api_url = 'http://localhost:8080'
    } else {
      api_url = 'https://app.tesselo.com/login'
    }

    beforeEach(async () => {
        browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        page = await browser.newPage();
        await page.goto(api_url);
    }, 90000);

    afterEach(async () => {
        await browser.close();
    });

    it("should display success notification if login detail is valid", async () => {
        await page.type('input[name="username"]', process.env.TEST_USER);
        await page.type('input[name="password"]', process.env.TEST_PASSWORD);
        await Promise.all([
          page.click('.login-button'),
          page.waitForNavigation({
            waitUntil: 'networkidle0',
          }),
        ]);
        expect(await page.$('.menu')).toBeTruthy();
    }, 10000);

    it("should display error notification if login detail is invalid", async () => {
        await page.type('input[name="username"]', 'lucille');
        await page.type('input[name="password"]', 'not banana stand');
        await page.click('.login-button');
        expect(await page.$('.tsl-form__control-error')).toBeTruthy();
    });
});
