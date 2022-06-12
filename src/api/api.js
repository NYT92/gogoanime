const axios = require('axios');
const cheerio = require('cheerio');
const url = require('./urls');
const { generateEncryptAjaxParameters, decryptEncryptAjaxResponse } = require('./getm3u8');

const BASE_URL = "https://gogoanime.film/"
//const BASE_URL2 = "https://gogoanime.gg/"
const ajax_url = "https://ajax.gogo-load.com/"
//const anime_info_url = "https://gogoanime.film/category/"
//const anime_movies_path = "/anime-movies.html"
//const popular_path = "/popular.html"
//const new_season_path = "/new-season.html"
//const search_path = "/search.html"
const popular_ongoing_url = `${ajax_url}ajax/page-recent-release-ongoing.html`;
//const recent_release_url = `${ajax_url}ajax/page-recent-release.html`
//const list_episodes_url = `${ajax_url}ajax/load-list-episode`

const ongoingSeries = async () => {
  const res = await axios.get(`${url.BASE_URL}`);
  const body = await res.data;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.main_body div.series nav.menu_series ul li').each((index, element) => {
    const $element = $(element);
    const id = $element.find('a').attr('href').split('/')[2];
    const title = $element.find('a').text().trim();
    promises.push({
      title: title ? title : null,
      id: id ? id : null,
    })
  })
  return await Promise.all(promises);
};

const topaired = async ({ list = [], page = 1 }) => {
  if (page == -1) {
    let pageNum = 1
    let hasMore = true
    while (hasMore) {
      const popular_page = await axios.get(`
                ${popular_ongoing_url}?page=${pageNum}
                `)
      const $ = cheerio.load(popular_page.data)
      if ($('div.added_series_body.popular > ul > li').length == 0) {
        hasMore = false
        continue
      }
      $('div.added_series_body.popular > ul > li').each((i, el) => {
        let genres = []
        $(el).find('p.genres > a').each((i, el) => {
          genres.push($(el).attr('title'))
        })
        list.push({
          animeId: $(el).find('a:nth-child(1)').attr('href').split('/')[2],
          animeTitle: $(el).find('a:nth-child(1)').attr('title'),
          // eslint-disable-next-line no-useless-escape
          animeImg: $(el).find('a:nth-child(1) > div').attr('style').match('(https?:\/\/.*\.(?:png|jpg))')[0],
          latestEp: $(el).find('p:nth-child(4) > a').text().trim(),
          animeUrl: BASE_URL + "/" + $(el).find('a:nth-child(1)').attr('href'),
          genres: genres
        })
      })
      pageNum++
    }
    return list
  }
  const popular_page = await axios.get(`
        ${popular_ongoing_url}?page=${page}
        `)
  const $ = cheerio.load(popular_page.data)
  $('div.added_series_body.popular > ul > li').each((i, el) => {
    let genres = []
    $(el).find('p.genres > a').each((i, el) => {
      genres.push($(el).attr('title'))
    })
    list.push({
      id: $(el).find('a:nth-child(1)').attr('href').split('/')[2],
      title: $(el).find('a:nth-child(1)').attr('title'),
      // eslint-disable-next-line no-useless-escape
      img: $(el).find('a:nth-child(1) > div').attr('style').match('(https?:\/\/.*\.(?:png|jpg))')[0],
      latestep: $(el).find('p:nth-child(4) > a').text().trim(),
      genres: genres
    })
  })

  return list
}

const search = async (query) => {
  const res = await axios.get(`${url.BASE_URL}/search.html?keyword=${query}`);
  const body = await res.data;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.main_body div.last_episodes ul.items li').each((index, element) => {
    const $element = $(element);
    //find id then trim /category/
    const id = $element.find('a').attr('href').split('/')[2];
    const title = $element.find('a').text().trim();
    const img = $element.find('img').attr('src');
    promises.push({
      title: title ? title : null,
      img: img ? img : null,
      id: id ? id : null,
    })
  });
  return await Promise.all(promises);
};

const genres = async (genre, page) => {
  const res = await axios.get(`${url.BASE_URL}/genre/${genre}?page=${page}`);
  const body = await res.data;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.main_body div.last_episodes ul.items li').each((index, element) => {
    const $element = $(element);
    const id = $element.find('a').attr('href').split('/')[2];
    const title = $element.find('a').text().trim();
    const img = $element.find('img').attr('src');
    promises.push({
      title: title ? title : null,
      img: img ? img : null,
      id: id ? id : null,
    })
  });
  return await Promise.all(promises);
};

const alphabetList = async (letter, page) => {
  const res = await axios.get(`${url.BASE_URL}/anime-list-${letter}?page=${page}`)
  const body = await res.data;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.main_body div.anime_list_body ul.listing li').each((index, element) => {
    const $element = $(element);
    const id = $element.find('a').attr('href').split('/')[2];
    const title = $element.find('a').text().trim();
    promises.push({
      title: title ? title : null,
      id: id ? id : null,
    })
  });
  return await Promise.all(promises);
};

const newSeasons = async (page) => {
  const res = await axios.get(`${url.BASE_URL}/new-season.html?page=${page}`)
  const body = await res.data;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.main_body div.last_episodes ul.items li').each((index, element) => {
    const $element = $(element);
    const id = $element.find('a').attr('href').split('/')[2];
    const title = $element.find('a').text().trim();
    const img = $element.find('img').attr('src');
    promises.push({
      title: title ? title : null,
      img: img ? img : null,
      id: id ? id : null,
    })
  })
  return await Promise.all(promises);
};

const movies = async (page) => {
  const res = await axios.get(`${url.BASE_URL}/anime-movies.html?page=${page}`);
  const body = await res.data;
  const $ = cheerio.load(body);
  const data = [];
  $('div.main_body div.last_episodes ul.items li').each((index, element) => {
    const $element = $(element);
    const id = $element.find('a').attr('href').split('/')[2];
    const title = $element.find('a').text().trim();
    const img = $element.find('img').attr('src');
    data.push({
      title: title ? title : null,
      img: img ? img : null,
      id: id ? id : null,
    })
  })

  return await Promise.all(data);
};

const popular = async (page) => {
  const res = await axios.get(`${url.BASE_URL}/popular.html?page=${page}`);
  const body = await res.data;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.main_body div.last_episodes ul.items li').each((index, element) => {
    const $element = $(element);
    const id = $element.find('a').attr('href').split('/')[2];
    const title = $element.find('a').text().trim();
    const img = $element.find('img').attr('src');
    promises.push({
      title: title ? title : null,
      img: img ? img : null,
      id: id ? id : null,
    })
  })
  return await Promise.all(promises);
};

const recentlyAddedSeries = async () => {
  const res = await axios.get(`${url.BASE_URL}`);
  const body = await res.data;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.main_body.none div.added_series_body ul.listing li').each((index, element) => {
    const $element = $(element);
    const id = $element.find('a').attr('href').split('/')[2];
    const title = $element.find('a').text().trim();
    promises.push({
      title: title ? title : null,
      id: id ? id : null,
    })
  });
  return await Promise.all(promises);
};

const recentReleaseEpisodes = async (page) => {
  const res = await axios.get(`${url.BASE_URL}/?page=${page}`);
  const body = await res.data;
  const $ = cheerio.load(body);
  const promises = [];

  $('div.main_body div.last_episodes.loaddub ul.items li').each((index, element) => {
    const $element = $(element);
    const idEpisode = $element.find('p.name a').attr('href').split('/')[1];
    const title = $element.find('p.name a').text();
    const id = idEpisode.split('-episode-')[0];
    const img = $element.find('img').attr('src');
    const episode = $element.find('p.episode').text();
    promises.push({
      title: title ? title : null,
      img: img ? img : null,
      episode: episode ? episode : null,
      episode_id: idEpisode ? idEpisode : null,
      id: id ? id : null,
    })
  });
  return await Promise.all(promises);
};

const animeEpisodeHandler = async (id) => {
  const res = await axios.get(`${url.BASE_URL}/${id}`);
  const body = await res.data;
  const $ = cheerio.load(body);
  const promises = [];

  $('div#wrapper_bg').each((index, element) => {
    const $element = $(element);
    const animeId = $element.find('div.anime_video_body div.anime_video_body_cate div.anime-info a').attr('href');
    const category = $element.find('div.anime_video_body div.anime_video_body_cate a').attr('href').split('/')[2].trim();
    const servers = [];
    const id = $element.find('div.anime_video_body div.anime_video_body_cate div.anime-info a').attr('href').split('/')[2];
    const episode = $element.find('div.anime_name div.title_name h2').text().trim().split('Episode ')[1].split(' ')[0];
    $element.find('div.anime_muti_link ul li').each((j, el) => {
      const $el = $(el);
      const name = $el.find('a').text().substring(0, $el.find('a').text().lastIndexOf('C')).trim();
      let iframe = $el.find('a').attr('data-video');
      if (iframe.startsWith('//')) {
        iframe = $el.find('a').attr('data-video').slice(2);
        if (iframe.indexOf('goload.pro') !== -1) {
          iframe = `https://${iframe}`;
        }
      }
      servers.push({
        name: name,
        iframe: iframe
      });
    })
    promises.push(animeContentHandler(animeId).then(extra => ({
      title: extra[0] ? extra[0].title : null,
      id: id,
      img: extra[0] ? extra[0].img : null,
      episode: episode,
      synopsis: extra[0] ? extra[0].synopsis : null,
      genres: extra[0] ? extra[0].genres : null,
      category: category ? category : null,
      released: extra[0] ? extra[0].released : null,
      status: extra[0] ? extra[0].status : null,
      otherName: extra[0] ? extra[0].otherName : null,
      totalEpisodes: extra[0] ? extra[0].totalEpisodes : null,
      servers: servers ? servers : null,
    })));
  })

  return await Promise.all(promises);
}

const animeContentHandler = async (id) => {
  const res = await axios.get(`${url.BASE_URL}${id}`);
  const body = await res.data;
  const $ = cheerio.load(body);
  const promises = [];
  let check_zero_episode = false;
  const check_zero_episode_axios = await axios.get(`${url.BASE_URL}${id.split('/')[2]}`);
  const check_zero_episode_body = await check_zero_episode_axios.data;
  const check_zero_episode_cheerio = cheerio.load(check_zero_episode_body);
  if (check_zero_episode_cheerio('.entry-title').text() != '404') {
    check_zero_episode = true
  }

  $('div#wrapper_bg').each((index, element) => {
    const $element = $(element);
    const img = $element.find('div.anime_info_body_bg img').attr('src');
    const synopsis = $element.find('div.anime_info_body_bg p.type').eq(1).text();
    const title = $element.find('div.anime_info_body_bg h1').text().trim();
    const genres = [];
    $element.find('div.anime_info_body_bg p.type').eq(2).find('a').each((j, el) => {
      const $el = $(el);
      const genre = $el.attr('href').split('/')[4];
      genres.push(genre);
    });
    const released = parseInt($element.find('div.anime_info_body_bg p.type').eq(3).text().match(/\d+/g), 10);
    const status = $element.find('div.anime_info_body_bg p.type').eq(4).text().replace('Status:', '').trim();
    const otherName = $element.find('div.anime_info_body_bg p.type').eq(5).text().replace('Other name:', '').trim();
    const liTotal = $('div.anime_video_body ul#episode_page li').length;
    var totalEpisodes = parseInt($('div.anime_video_body ul#episode_page li').eq(liTotal - 1).find('a').text().split('-')[1], 10);
    if (!totalEpisodes) {
      totalEpisodes = parseInt($('div.anime_video_body ul#episode_page li').eq(liTotal - 1).find('a').text(), 10);
    }
    const id = $element.find('div.anime_video_body ul#episode_page li').eq(0).find('a').attr('href').split('/')[1];
    let episodes = Array.from({ length: totalEpisodes }, (v, k) => {
      const animeId = `${id}-episode-${k + 1}`.slice(10);
      return {
        id: animeId
      }
    });

    if (check_zero_episode) {
      episodes.unshift({ id: id.split('/')[2] });
    }

    promises.push({
      img: img,
      title: title,
      id: id,
      synopsis: synopsis,
      genres: genres,
      released: released,
      status: status,
      otherName: otherName,
      totalEpisodes: check_zero_episode ? totalEpisodes + 1 : totalEpisodes,
      episodes: episodes
    });
  });
  return await Promise.all(promises);
};

const animeInfo = async (id) => {
  const res = await axios.get(`${url.BASE_URL}/category/${id}`);
  const body = await res.data;
  const $ = cheerio.load(body);
  const promises = [];
  $('div#wrapper_bg').each((index, element) => {
    const $element = $(element);
    const img = $element.find('div.anime_info_body_bg img').attr('src');
    const synopsis = $element.find('div.anime_info_body_bg p.type').eq(1).text();
    const title = $element.find('div.anime_info_body_bg h1').text();
    const genres = [];
    $element.find('div.anime_info_body_bg p.type').eq(2).find('a').each((j, el) => {
      const $el = $(el);
      const genre = $el.attr('href').split('/')[4];
      genres.push(genre);
    });
    const released = parseInt($element.find('div.anime_info_body_bg p.type').eq(3).text().match(/\d+/g), 10);
    const status = $element.find('div.anime_info_body_bg p.type').eq(4).text().replace('Status:', '').trim();
    const otherName = $element.find('div.anime_info_body_bg p.type').eq(5).text().replace('Other name:', '').trim();
    const liTotal = $('div.anime_video_body ul#episode_page li').length;
    var totalEpisodes = parseInt($('div.anime_video_body ul#episode_page li').eq(liTotal - 1).find('a').text().split('-')[1], 10);
    if (!totalEpisodes) {
      totalEpisodes = parseInt($('div.anime_video_body ul#episode_page li').eq(liTotal - 1).find('a').text(), 10);
    }
    let episodes = Array.from({ length: totalEpisodes }, (v, k) => {
      const animeId = `${id}-episode-${k + 1}`;
      return {
        id: animeId
      }
    });
    const pushh = {
      anime_id: id,
      title: title,
      img: img,
      synopsis: synopsis,
      genres: genres,
      released: released,
      status: status,
      otherName: otherName,
      totalEpisodes: totalEpisodes,
      episodes: episodes
    }
    promises.push(pushh);
  });
  return await Promise.all(promises);
}

const getIframe = async (id) => {
  const res = await axios.get(`${url.BASE_URL}/${id}`);
  const body = await res.data;
  const $ = cheerio.load(body);
  const promises = [];
  $('div#wrapper_bg').each((index, element) => {
    const $element = $(element);
    const servers = [];
    const id = $element.find('div.anime_video_body div.anime_video_body_cate div.anime-info a').attr('href').split('/')[2];
    const episode = $element.find('div.anime_name div.title_name h2').text().trim().split('Episode ')[1].split(' ')[0];
    $element.find('div.anime_muti_link ul li').each((j, el) => {
      const $el = $(el);
      const name = $el.find('a').text().substring(0, $el.find('a').text().lastIndexOf('C')).trim();
      let iframe = $el.find('a').attr('data-video');
      if (iframe.startsWith('//')) {
        iframe = $el.find('a').attr('data-video').slice(2);
        if (iframe.indexOf('goload.pro') !== -1) {
          iframe = `https://${iframe}`;
        }
      }
      servers.push({
        name: name,
        iframe: iframe
      });
    })
    const pushh = {
      servers: servers,
      id: id,
      episode: episode
    }
    promises.push(pushh);
  });
  return await Promise.all(promises);
}


const getHls = async ({ id }) => {
  const goload_stream_url = "https://goload.pro/streaming.php"
  var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36";
  try {
    let sources = [];
    let sources_bk = [];
    let epPage, server, $, serverUrl;
    if (id.includes("episode")) {
      epPage = await axios.get(`${url.BASE_URL}` + id);
      $ = cheerio.load(epPage.data)
      server = $('#load_anime > div > div > iframe').attr('src')
      serverUrl = new URL("https:" + server)
    } else serverUrl = new URL(`${goload_stream_url}?id=${id}`)
    const goGoServerPage = await axios.get(serverUrl.href, { headers: { 'User-Agent': USER_AGENT } })
    const $$ = cheerio.load(goGoServerPage.data)
    const params = await generateEncryptAjaxParameters($$, serverUrl.searchParams.get('id'));
    const fetchRes = await axios.get(`
          ${serverUrl.protocol}//${serverUrl.hostname}/encrypt-ajax.php?${params}`, {
      headers: {
        'User-Agent': USER_AGENT,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    const res = decryptEncryptAjaxResponse(fetchRes.data)
    if (!res.source) return { error: "No sources found!! Try different source." };
    res.source.forEach(source => sources.push(source))
    res.source_bk.forEach(source => sources_bk.push(source))

    return { sources, sources_bk };
  }
  catch (err) {
    return ({ error: "hls sources not available" });
  }
}

module.exports = {
  animeEpisodeHandler,
  animeInfo,
  topaired,
  getHls,
  getIframe,
  recentReleaseEpisodes,
  recentlyAddedSeries,
  ongoingSeries,
  alphabetList,
  newSeasons,
  movies,
  popular,
  search,
  genres,
}