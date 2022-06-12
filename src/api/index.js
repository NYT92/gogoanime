const express = require('express');
const routes = require('./routes/index');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    info: "This Gogoanime API by ChrisMP is modified to improve speeds and esaier for uses.",
    credit: 'gogoanime API by ChrisMichaelPerezSantiago // HLS Decoder Script by riimuru',
    endpoint: {
      search: '/search/:query',
      searchQuery: '/search?q=',
      anime_info: '/anime/info/:id',
      anime_episode: '/anime/episode/:id',
      recent_release_episode: '/recentrelease/:page',
      recent_series : '/recentseries',
      ongoing: '/ongoing/:page',
      alphabet: '/alphabet/:letter/:page',
      popular: '/popular/:page',
      genre: '/genre/:genre/:page',
      movie: '/movie/:page',
      new_season: '/newseason/:page',
      top_airing: '/topairing?p=:page',
      decodeurl: {
        endpoint:'/decodeurl/:id',
        info: 'credit to https://github.com/riimuru/gogoanime that found a way to decode the hls url',
      },
    },
    license: 'MIT // https://github.com/ChrisMichaelPerezSantiago/gogoanime/blob/master/LICENSE',
    github_url: 'https://github.com/ChrisMichaelPerezSantiago/gogoanime',
    api_url: "/api/",
    hoster: "@nyt92 on github // https://github.com/nyt92"
  });
});

router.use('/', routes);

module.exports = router;