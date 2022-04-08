const https = require('https');
const fs = require('fs');
const puppeteer = require('puppeteer');


(async function () {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://kdvonline.ru/catalog/shokolad-5');
    await page.waitForSelector('.b3s8K6a5X');

    await page.setViewport({
        width: 1500,
        height: 800
    });


    await page.screenshot({ path: 'screenshot.png' });
    await page.waitForSelector('.b3s8K6a5X');

    let images = await page.evaluate(() => {
        let imgElements = document.querySelectorAll('.b3s8K6a5X img.mKV5--oM0');
        let priceElements = document.querySelectorAll('.b3s8K6a5X .b2iP1cx1b');

        
        let URLs = Object.values(imgElements).map((imgElement, index) => {
            let prices = Object.values(priceElements).map((priceEl)=> {
                return {
                    price: priceEl.textContent
                }
            })
            return {
                id: index,
                src: imgElement.src,
                alt: imgElement.alt,
                price: parseInt(Object.values(prices[index]))
            }
        })
        
        

        return URLs;
    })
    // console.log(images);
    fs.writeFile('imagesURL.json', JSON.stringify(images, null, ' '), err => {
        if (err) return err;
        console.log('images > imagesURL.json');
    })
    // images.forEach(
    //     (image, index) => {
    //         const file = fs.createWriteStream(`kdv-online/${index}.png`);
    //         const request = https.get(image.src, response => {
    //             response.pipe(file);
    //         })
    //     }
    // )

    await browser.close();

})();