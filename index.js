const https = require('https');
const fs = require('fs');
const puppeteer = require('puppeteer');


(async function () {
    const browser = await puppeteer.launch({ headless: true }); // headless: true - без браузера
    const page = await browser.newPage(); // создать новую страницу в puppeteer
    await page.goto('https://kdvonline.ru/catalog/shokolad-5'); // ссылка которую нужно парсить
    await page.waitForSelector('.b3s8K6a5X'); // ждём подгрузки блока где наши продукты из интернет магазина

    await page.setViewport({ // открыть окно размером 1500 x 800
        width: 1500,
        height: 800
    });


    await page.screenshot({ path: 'screenshot.png' }); // Делает скриншот страницы
    await page.waitForSelector('.b3s8K6a5X'); // ждём загрузки того же блока что и сверху

    let images = await page.evaluate(() => {
        let imgElements = document.querySelectorAll('.b3s8K6a5X img.mKV5--oM0'); // получаем каждую картинку
        let priceElements = document.querySelectorAll('.b3s8K6a5X .b2iP1cx1b'); // получаем каждую цену

        
        let products = Object.values(imgElements).map((imgElement, index) => { 
            let prices = Object.values(priceElements).map((priceEl)=> { // создаём обьект с ценами
                return {
                    price: priceEl.textContent // содержимое дива
                }
            })
            return {
                id: index,
                src: imgElement.src,
                alt: imgElement.alt,
                price: parseInt(Object.values(prices[index])) // Получаем значение у обьекта Цена
            }
        })
        
        

        return products;
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