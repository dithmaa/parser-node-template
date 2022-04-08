const https = require('https');
const fs = require('fs');
const puppeteer = require('puppeteer');


(async function () {
    const browser = await puppeteer.launch({ headless: false }); // headless: true - без браузера
    const page = await browser.newPage(); // создать новую страницу в puppeteer

    await page.goto(`https://megatitan.ru/`); // ссылка которую нужно парсить
    await page.setViewport({ // открыть окно размером 1500 x 800
        width: 1700,
        height: 800
    });
    await page.waitForSelector('#buyer_delivery'); // ждём подгрузки формы или инпута
    await page.waitForTimeout(4000);
    await page.waitForSelector('#buyer_address'); // ждём подгрузки формы или инпута
    await page.click('#buyer_address'); // ждём подгрузки формы или инпута
    await page.type('#buyer_address', 'фрунзе'); // ждём подгрузки формы или инпута
    await page.waitForTimeout(1000);
    await page.waitForSelector('#buyer_address');
    await page.click('#buyer_city');

    await page.waitForTimeout(1000); // ждёт 3 секунды чтобы успелось всё подгрузиться

    await page.waitForSelector('.error .colored');
    await page.click('.error .colored');

    await page.waitForSelector('#buyer_pickup');
    await page.click('#buyer_pickup button');

    

    
    await page.screenshot({ path: 'screenshot1.png' }); // Делает скриншот страницы
    /*
    let images;
    let finalObj = [];
    
    for (let i = 1; i <= 4; i++) {
       await page.goto(`https://tgabsolut-shop.ru/catalog/konditerskie-izdeliya2/shokolad/?PAGEN_1=${i}`); // ссылка которую нужно парсить
        await page.waitForSelector('.catalog_block'); // ждём загрузки того же блока что и сверху


        images = await page.evaluate(() => {
            let imgElements = document.querySelectorAll('.catalog_block  .image_wrapper_block img'); // получаем каждую картинку
            let priceElements = document.querySelectorAll('.catalog_block .price .price_value'); // получаем каждую цену


            let products = Object.values(imgElements).map((imgElement, index) => {
                let prices = Object.values(priceElements).map((priceEl)=> { // создаём обьект с ценами
                    return {
                        price: priceEl.textContent // содержимое дива
                    }
                })
                return {
                    src: imgElement.src,
                    alt: imgElement.alt,
                    price: parseInt(Object.values(prices[index])) // Получаем значение у обьекта Цена
                }
            })
            return products;
        })
        finalObj.push(images); // Тут помучался и сделал объединение всех массивов в один

    }
    let final = finalObj.flat().map((obj, index)=> ({
        id: index,
        src: obj.src,
        alt: obj.alt,
        price: obj.price
    }))
    fs.writeFile('imagesURL-Absolut.json', JSON.stringify(final, null, ' '), err => { // и ещё выучил метод flat который поднимает навверх
        if (err) return err;
        console.log('images > imagesURL.json');
    })

    */



    // await browser.close();
})();