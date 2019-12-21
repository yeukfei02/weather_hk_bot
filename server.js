// bot name: weatherHKBot
// link: t.me/weatherHKBot
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const TextCommand = Telegram.TextCommand;
const $ = new Telegram.Telegram(process.env.TELEGRAM_KEY);

const axios = require("axios");
const _ = require("lodash");
const parseString = require('xml2js').parseString;
const htmlToText = require('html-to-text');

// store user setting
const languageObj = {
  english: 'English',
  traditionalChinese: '繁體中文',
  simplifiedChinese: '简体中文'
};

const currentURLObj = {
  english: 'http://rss.weather.gov.hk/rss/CurrentWeather.xml',
  traditionalChinese: 'http://rss.weather.gov.hk/rss/CurrentWeather_uc.xml',
  simplifiedChinese: 'http://gbrss.weather.gov.hk/rss/CurrentWeather_uc.xml'
};

const warningInformationURLObj = {
  english: 'http://rss.weather.gov.hk/rss/WeatherWarningBulletin.xml',
  traditionalChinese: 'http://rss.weather.gov.hk/rss/WeatherWarningBulletin_uc.xml',
  simplifiedChinese: 'http://gbrss.weather.gov.hk/rss/WeatherWarningBulletin_uc.xml'
};

const warningSummaryURLObj = {
  english: 'http://rss.weather.gov.hk/rss/WeatherWarningSummaryv2.xml',
  traditionalChinese: 'http://rss.weather.gov.hk/rss/WeatherWarningSummaryv2_uc.xml',
  simplifiedChinese: 'http://gbrss.weather.gov.hk/rss/WeatherWarningSummaryv2_uc.xml'
};

let subscribeWarning = true;
let language = languageObj.english;
let currentURL = currentURLObj.english;
let warningInformationURL = warningInformationURLObj.english;
let warningSummaryURL = warningSummaryURLObj.english;

function getResponse($, urlLink, strToShow) {
  axios.get(urlLink)
    .then((response) => {
      parseString(response.data, (err, result) => {
        if (!err) {
          if (!_.isEmpty(result.rss.channel)) {
            result.rss.channel.map((item, i) => {
              if (!_.isEmpty(item.item)) {
                item.item.map((value, i) => {
                  const response = value.description.toString();

                  const text = htmlToText.fromString(response, {
                    wordwrap: 130,
                    //ignoreImage: true
                  });
                  $.sendMessage(`------------------ [${strToShow}] ------------------`);
                  $.sendMessage(text);
                });
              }
            });
          }
        }
      });
    })
    .catch((error) => {
      console.log("error = ", error);
    });
}

class StartController extends TelegramBaseController {
  startHandler($) {
    $.sendMessage(`
      ### Example command ###
/start
Show all example command

/tellMeCurrentAndWarning
List out the topic of current weather, warning

/tellMeCurrent
Echo back the current info in forecast feed

/tellMeWarning
Echo back the current info in weather warning

/subscribeWarning
Enable warning message

/unsubscribeWarning
Disable warning message

/繁體中文
Set content in Traditional Chinese

/简体中文
Set content in Simplified Chinese

/english
Set content in English
    `);
  }

  get routes() {
    return {
      'startCommand': 'startHandler'
    }
  }
}

class TellMeCurrentAndWarningController extends TelegramBaseController {
  tellMeCurrentAndWarningHandler($) {
    switch (language) {
      case 'English':
        getResponse($, currentURL, 'Current');
        if (subscribeWarning) {
          getResponse($, warningInformationURL, 'Warning');
        } else {
          $.sendMessage('Please subscribe warning');
        }
        break;
      case '繁體中文':
        getResponse($, currentURL, '現時');
        if (subscribeWarning) {
          getResponse($, warningInformationURL, '警告');
        } else {
          $.sendMessage('Please subscribe warning');
        }
        break;
      case '简体中文':
        getResponse($, currentURL, '现时');
        if (subscribeWarning) {
          getResponse($, warningInformationURL, '警告');
        } else {
          $.sendMessage('Please subscribe warning');
        }
        break;
    }
  }

  get routes() {
    return {
      'tellMeCurrentAndWarningCommand': 'tellMeCurrentAndWarningHandler'
    }
  }
}

class TellmeCurrentController extends TelegramBaseController {
  tellMeCurrentHandler($) {
    switch (language) {
      case 'English':
        getResponse($, currentURL, 'Current');
        break;
      case '繁體中文':
        getResponse($, currentURL, '現時');
        break;
      case '简体中文':
        getResponse($, currentURL, '现时');
        break;
    }
  }

  get routes() {
    return {
      'tellMeCurrentCommand': 'tellMeCurrentHandler'
    }
  }
}

class TellmeWarningController extends TelegramBaseController {
  tellMeWarningHandler($) {
    switch (language) {
      case 'English':
        if (subscribeWarning) {
          getResponse($, warningSummaryURL, 'Warning');
        } else {
          $.sendMessage('Please subscribe warning');
        }
        break;
      case '繁體中文':
        if (subscribeWarning) {
          getResponse($, warningSummaryURL, '警告');
        } else {
          $.sendMessage('Please subscribe warning');
        }
        break;
      case '简体中文':
        if (subscribeWarning) {
          getResponse($, warningSummaryURL, '警告');
        } else {
          $.sendMessage('Please subscribe warning');
        }
        break;
    }
  }

  get routes() {
    return {
      'tellMeWarningCommand': 'tellMeWarningHandler'
    }
  }
}

class SubscribeWarningController extends TelegramBaseController {
  subscribeWarningHandler($) {
    subscribeWarning = true;

    $.sendMessage('You just subscribe warning');
  }

  get routes() {
    return {
      'subscribeWarningCommand': 'subscribeWarningHandler'
    }
  }
}

class UnsubscribeWarningController extends TelegramBaseController {
  unsubscribeWarningHandler($) {
    subscribeWarning = false;

    $.sendMessage('You just unsubscribe warning');
  }

  get routes() {
    return {
      'unsubscribeWarningCommand': 'unsubscribeWarningHandler'
    }
  }
}

class EnglishController extends TelegramBaseController {
  englishHandler($) {
    language = languageObj.english;
    currentURL = currentURLObj.english;
    warningInformationURL = warningInformationURLObj.english;
    warningSummaryURL = warningSummaryURLObj.english;

    $.sendMessage('OK');
  }

  get routes() {
    return {
      'englishCommand': 'englishHandler'
    }
  }
}


class TraditionalChineseController extends TelegramBaseController {
  traditionalChineseHandler($) {
    language = languageObj.traditionalChinese;
    currentURL = currentURLObj.traditionalChinese;
    warningInformationURL = warningInformationURLObj.traditionalChinese;
    warningSummaryURL = warningSummaryURLObj.traditionalChinese;

    $.sendMessage('知道了');
  }

  get routes() {
    return {
      'traditionalChineseCommand': 'traditionalChineseHandler'
    }
  }
}

class SimplifiedChineseController extends TelegramBaseController {
  simplifiedChineseHandler($) {
    language = languageObj.simplifiedChinese;
    currentURL = currentURLObj.simplifiedChinese;
    warningInformationURL = warningInformationURLObj.simplifiedChinese;
    warningSummaryURL = warningSummaryURLObj.simplifiedChinese;

    $.sendMessage('知道了');
  }

  get routes() {
    return {
      'simplifiedChineseCommand': 'simplifiedChineseHandler'
    }
  }
}

$.router
  .when(new TextCommand('/start', 'startCommand'), new StartController())
  .when(new TextCommand('/tellMeCurrentAndWarning', 'tellMeCurrentAndWarningCommand'), new TellMeCurrentAndWarningController())
  .when(new TextCommand('/tellMeCurrent', 'tellMeCurrentCommand'), new TellmeCurrentController())
  .when(new TextCommand('/tellMeWarning', 'tellMeWarningCommand'), new TellmeWarningController())
  .when(new TextCommand('/subscribeWarning', 'subscribeWarningCommand'), new SubscribeWarningController())
  .when(new TextCommand('/unsubscribeWarning', 'unsubscribeWarningCommand'), new UnsubscribeWarningController())
  .when(new TextCommand('/english', 'englishCommand'), new EnglishController())
  .when(new TextCommand('/繁體中文', 'traditionalChineseCommand'), new TraditionalChineseController())
  .when(new TextCommand('/简体中文', 'simplifiedChineseCommand'), new SimplifiedChineseController());
