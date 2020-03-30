const url = 'https://github.com/topics';
const $ = require('cheerio');
const express = require('express');
const rp = require('request-promise');
const ejs = require('ejs');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname, +'/styles'));

app.get('/', async (req, res) => {
  try {
    const data = await rp(url);
    const topics = [];
    const descriptions = [];
    const links = [];

    //Topics
    $('div > .f3', data).each((i, topic) => {
      topics.push($(topic).text());
    });

    //Descriptions
    $('div > .f5.text-gray', data).each((i, description) => {
      descriptions.push($(description).text());
    });
    console.log(descriptions);

    //Links
    $('.py-4 > a', data).each((i, link) => {
      links.push($(link).attr('href'));
    });

    const result = topics.map((topic, index) => {
      return {
        topic,
        description: descriptions[index],
        link: `https://github.com${links[index]}`
      };
    });

    res.render('index', { result });
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => {
  console.log(`The server is live on port ${PORT} !`);
});
