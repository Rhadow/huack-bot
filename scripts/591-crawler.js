'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var fetchUrl = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url) {
        var res, data;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        res = undefined, data = undefined;
                        _context.prev = 1;
                        _context.next = 4;
                        return (0, _nodeFetch2.default)(url);

                    case 4:
                        res = _context.sent;
                        _context.next = 7;
                        return res.json();

                    case 7:
                        data = _context.sent;
                        return _context.abrupt('return', data);

                    case 11:
                        _context.prev = 11;
                        _context.t0 = _context['catch'](1);
                        return _context.abrupt('return', 'Crawling failed...');

                    case 14:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[1, 11]]);
    }));
    return function fetchUrl(_x) {
        return ref.apply(this, arguments);
    };
}();

var generateUrls = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(initialUrl) {
        var totalRows, data;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        totalRows = 0;
                        _context2.next = 3;
                        return fetchUrl(initialUrl);

                    case 3:
                        data = _context2.sent;

                        if (!(typeof data === 'string')) {
                            _context2.next = 6;
                            break;
                        }

                        return _context2.abrupt('return', 'Crawling failed...');

                    case 6:
                        totalRows = data.count;
                        return _context2.abrupt('return', generateUrlsByPagination(initialUrl, totalRows));

                    case 8:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));
    return function generateUrls(_x2) {
        return ref.apply(this, arguments);
    };
}();

var crawl = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var INITIAL_URLS, urls, generatedTempUrls, tempData, crawledHtml, data, i, j;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        INITIAL_URLS = [
                        // 'http://rent.591.com.tw/index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&kind=2&rentprice=3&firstRow=0&totalRows=1000',
                        'http://rent.591.com.tw/index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&kind=2&rentprice=4&firstRow=0&totalRows=1000', 'http://rent.591.com.tw/index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&kind=1&rentprice=3&firstRow=0&totalRows=1000'];

                        // 'http://rent.591.com.tw/index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&kind=1&rentprice=4&firstRow=0&totalRows=1000'
                        urls = [], generatedTempUrls = [], tempData = undefined, crawledHtml = [], data = [];
                        i = 0;

                    case 3:
                        if (!(i < INITIAL_URLS.length)) {
                            _context3.next = 15;
                            break;
                        }

                        console.log('about to do initial fetch');
                        _context3.next = 7;
                        return generateUrls(INITIAL_URLS[i]);

                    case 7:
                        generatedTempUrls = _context3.sent;

                        if (!(typeof generatedUrls === 'string')) {
                            _context3.next = 10;
                            break;
                        }

                        return _context3.abrupt('return', 'Crawling failed...');

                    case 10:
                        urls = urls.concat(generatedTempUrls);
                        console.log('initial fetch complete');

                    case 12:
                        i++;
                        _context3.next = 3;
                        break;

                    case 15:
                        j = 0;

                    case 16:
                        if (!(j < urls.length)) {
                            _context3.next = 28;
                            break;
                        }

                        console.log('about to fetch ' + j);
                        _context3.next = 20;
                        return fetchUrl(urls[j]);

                    case 20:
                        tempData = _context3.sent;

                        if (!(typeof tempData === 'string')) {
                            _context3.next = 23;
                            break;
                        }

                        return _context3.abrupt('return', 'Crawling failed...');

                    case 23:
                        crawledHtml = crawledHtml.concat(tempData.main);
                        console.log('Fetch complete...length is ' + crawledHtml.length);

                    case 25:
                        j++;
                        _context3.next = 16;
                        break;

                    case 28:
                        data = crawledHtml.map(parseData).reduce(function (acc, x) {
                            return acc.concat(x);
                        }, []);
                        console.log('Crawling successed!');
                        return _context3.abrupt('return', data);

                    case 31:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));
    return function crawl() {
        return ref.apply(this, arguments);
    };
}();

exports.default = function (robot) {
    var _this2 = this;

    robot.respond(/clear 591/, function (res) {
        robot.brain.set('591-data', []);
        res.send('cleared');
    });
    robot.hear(/crawl 591/i, function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(res) {
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            new _cron.CronJob('30 */1 * * * *', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
                                var newData, oldData, response, isDataExisted, dataToReport;
                                return _regenerator2.default.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                _context4.next = 2;
                                                return crawl();

                                            case 2:
                                                newData = _context4.sent;
                                                oldData = robot.brain.get('591-data') || [];
                                                response = '';
                                                isDataExisted = false;
                                                dataToReport = [];


                                                if (typeof tempData === 'string') {
                                                    res.reply('Crawling failed...');
                                                } else {
                                                    newData.forEach(function (newD) {
                                                        isDataExisted = oldData.filter(function (oldD) {
                                                            return newD.href === oldD.href && newD.title === oldD.title;
                                                        }).length !== 0;
                                                        if (!isDataExisted) {
                                                            dataToReport.push(newD);
                                                        }
                                                    });
                                                    if (dataToReport.length) {
                                                        response = 'Update!! (' + new Date().toLocaleString() + ')\n' + dataToReport.map(function (data) {
                                                            return data.title + ' \n ' + data.href + '\n=======================\n';
                                                        }).join('');
                                                        res.send(response);
                                                        robot.brain.set('591-data', newData);
                                                    }
                                                }

                                            case 8:
                                            case 'end':
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, _this2);
                            })), null, true);

                        case 1:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this2);
        })),
            _this = _this2;
        return function (_x3) {
            return ref.apply(_this, arguments);
        };
    }());
};

require('babel-polyfill');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _cron = require('cron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateUrlsByPagination(initialUrl, totalRows) {
    var step = 20,
        urls = [],
        currentRow = 0;

    while (currentRow < totalRows) {
        urls.push(initialUrl.replace(/firstRow=\d+/gi, 'firstRow=' + currentRow).replace(/totalRows=\d+/gi, 'totalRows=' + totalRows));
        currentRow += step;
    }
    return urls;
}

function parseData(htmlString) {
    var $ = _cheerio2.default.load(htmlString),
        links = $('a.imgbd'),
        result = [];
    links.each(function (i, elm) {
        result.push({
            title: elm.attribs.title,
            href: 'rent.591.com.tw/' + elm.attribs.href
        });
    });
    return result;
}

;
module.exports = exports['default'];