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

    

    
    await page.screenshot({ path: 'screenshot2.png' }); // Делает скриншот страницы
   
    let images;
    let finalObj = [];
    // async function autoScroll(page){
    //     await page.evaluate(async () => {
    //         await new Promise((resolve, reject) => {
    //             var totalHeight = 0;
    //             var distance = 1000;
    //             var timer = setInterval(() => {
    //                 var scrollHeight = document.body.scrollHeight;
    //                 window.scrollBy(0, distance);
    //                 totalHeight += distance;
    
    //                 if(totalHeight >= scrollHeight - window.innerHeight){
    //                     clearInterval(timer);
    //                     resolve();
    //                 }
    //             }, 1000);
    //         });
    //     });
    // }
    for (let i = 1; i <= 1; i++) {
       await page.goto(`https://megatitan.ru/catalog/shokoladnye_izdeliya_karamel_iris/shokoladnye_plitki/`); // ссылка которую нужно парсить
        await page.waitForSelector('.catalog_block'); // ждём загрузки того же блока что и сверху

        
        
        images = await page.evaluate(() => {
            let imgElements = document.querySelectorAll('.catalog_block  .image_wrapper_block img'); // получаем каждую картинку
            let priceElements = document.querySelectorAll('.catalog_block .price .price_value'); // получаем каждую цену
            let titleElement = document.querySelectorAll('.catalog_block .item-title span'); // получаем каждую цену


            let products = Object.values(imgElements).map((imgElement, index) => {
                let prices = Object.values(priceElements).map((priceEl)=> { // создаём обьект с ценами
                    return {
                        price: priceEl.textContent // содержимое дива
                    }
                })
                let titles = Object.values(titleElement).map((titleEL)=> { // создаём обьект с ценами
                    return {
                        title: titleEL.textContent // содержимое дива
                    }
                })
                return {
                    src: imgElement.src,
                    alt: imgElement.alt,
                    price: parseInt(Object.values(prices[index])), // Получаем значение у обьекта Цена
                    title: Object.values(titles[index]) // Получаем значение у обьекта Имя
                }
            })
            return products;
        })
        finalObj.push(images); // Тут помучался и сделал объединение всех массивов в один
        // await autoScroll(page);
        

    }
    let final = finalObj.flat().map((obj, index)=> ({
        id: index,
        src: obj.src,
        alt: obj.alt,
        price: obj.price,
        title: obj.title.join('')
    }))
    fs.writeFile('imagesURL-Titan.json', JSON.stringify(final, null, ' '), err => { // и ещё выучил метод flat который поднимает навверх
        if (err) return err;
        console.log('images > imagesURL.json');
    })
    



    await browser.close();
})();