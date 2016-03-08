import 'babel-polyfill';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { CronJob } from 'cron';

function generateUrlsByPagination(initialUrl, totalRows) {
    let step = 20,
        urls = [],
        currentRow = 0;

    while (currentRow < totalRows) {
        urls.push(initialUrl.replace(/firstRow=\d+/gi, `firstRow=${currentRow}`).replace(/totalRows=\d+/gi, `totalRows=${totalRows}`));
        currentRow += step;
    }
    return urls;
}

async function fetchUrl(url) {
    let res,
        data;

    try {
        res = await fetch(url);
        data = await res.json();
        return data;
    } catch (e) {
        return 'Crawling failed...';
    }
}

async function generateUrls(initialUrl) {
    let totalRows = 0,
        data = await fetchUrl(initialUrl);

    if (typeof data === 'string') {
        return 'Crawling failed...';
    }
    totalRows = data.count;
    return generateUrlsByPagination(initialUrl, totalRows);
}

function parseData(htmlString) {
    let $ = cheerio.load(htmlString),
        links = $('a.imgbd'),
        result = [];
    links.each((i, elm) => {
        result.push({
            title: elm.attribs.title,
            href: `rent.591.com.tw/${elm.attribs.href}`
        });
    });
    return result;
}

async function crawl() {
    const INITIAL_URLS = [
        'http://rent.591.com.tw/index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&kind=1&orderType=desc&shType=list&rentprice=0,25000&area=10,&firstRow=20&totalRows=1500',
        'http://rent.591.com.tw/index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&kind=2&orderType=desc&shType=list&rentprice=0,25000&area=10,&firstRow=20&totalRows=1500'
    ];
    let urls = [],
        generatedTempUrls = [],
        tempData,
        crawledHtml = [],
        data = [];

    for (let i = 0; i < INITIAL_URLS.length; i++) {
        console.log('about to do initial fetch');
        generatedTempUrls = await generateUrls(INITIAL_URLS[i]);
        if (typeof generatedUrls === 'string') {
            return 'Crawling failed...';
        }
        urls = urls.concat(generatedTempUrls);
        console.log('initial fetch complete');
    }
    for (let j = 0; j < urls.length; j++) {
        console.log(`about to fetch ${j}`);
        tempData = await fetchUrl(urls[j]);
        if (typeof tempData === 'string') {
            return 'Crawling failed...';
        }
        crawledHtml = crawledHtml.concat(tempData.main);
        console.log(`Fetch complete...length is ${crawledHtml.length}`);
    }
    data = crawledHtml.map(parseData).reduce((acc, x) => { return acc.concat(x); }, []);
    console.log('Crawling successed!');
    return data;
}

export default function(robot) {
    let job = {};
    robot.respond(/clear 591/, (res) => {
        robot.brain.set('591-data', []);
        res.send('cleared');
    });
    robot.respond(/stop 591/, (res) => {
        if (!job.stop) {
            res.send('No crawling is scheduled');
        } else {
            job.stop();
            job = {};
            res.send('Stopped crawling');
        }
    });
    robot.respond(/crawl 591/i, async (res) => {
        job = new CronJob('30 */20 * * * *', async () => {
            let newData = await crawl(),
                oldData = robot.brain.get('591-data') || [],
                response = '',
                isDataExisted = false,
                dataToReport = [];

            if (typeof tempData === 'string') {
                res.reply('Crawling failed...');
            } else {
                newData.forEach((newD) => {
                    isDataExisted = oldData.filter((oldD) => { return newD.href === oldD.href && newD.title === oldD.title; }).length !== 0;
                    if (!isDataExisted) {
                        dataToReport.push(newD);
                    }
                });
                if (dataToReport.length) {
                    response = `Update!! (${new Date().toLocaleString()})\n` + dataToReport.map((data) => {
                        return `${data.title} \n ${data.href}\n=======================\n`;
                    }).join('');
                    res.send(response);
                    robot.brain.set('591-data', oldData.concat(dataToReport));
                }
            }
        }, null, true);
    });
};
