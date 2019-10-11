const config = require('./config');
const Slimbot = require('slimbot');
const Parser = require('rss-parser');
const bot = new Slimbot(config.TELEGRAM_BOT_TOKEN);
const Vacancy = require('./dbSchema');

const parser = new Parser();

function getFeed(uri) {
	(async () => {
		let feed = await parser.parseURL(uri);
		makeMessage(feed.items);
	})();
}

function makeMessage(dataFeed) {
	dataFeed.forEach((vacancyItem) => {
		let vacancyMess = renderTextMessage(vacancyItem.title, vacancyItem.link, vacancyItem.content);
		if (vacancyMess) {
			new Vacancy({
				guid: vacancyItem.guid
			}).save()
				.then(() => sendBotMessage(vacancyMess))
				.catch(() => false);
		}
	});
}

function renderTextMessage(vTitle, vLink, vContent) {
	let typeVacancy,
		vacancyStr = `\n<b>${vTitle}</b>\n\n${vContent}\n\n<a href='${vLink}'>${vLink}</a>`;


	if (vContent.toLocaleLowerCase().indexOf('vue') > -1) {
		typeVacancy = 'vue';
	} else if (vContent.toLocaleLowerCase().indexOf('bitrix') > -1 || vContent.toLocaleLowerCase().indexOf('битрикс') > -1) {
		typeVacancy = 'битрикс';
	} else return false;

	vacancyStr = `#${typeVacancy}` + vacancyStr;

	return vacancyStr;
}

function sendBotMessage(message) {
	bot.sendMessage(config.CHAT_ID, message, {
		parse_mode: 'HTML',
	});
}


module.exports = {
	getFeed,
};