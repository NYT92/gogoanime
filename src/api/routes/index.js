// eslint-disable-next-line no-unused-vars
const { default: Axios } = require('axios');
const express = require('express');
const router = express.Router();
const api = require('../api');
const { base64encode } = require('nodejs-base64');

router.get('/search/:query', (req, res) => {
  const query = req.params.query;
  api.search(query)
    .then(search => {
      res.status(200).json({
        search
      });
    })
    .catch(() => {
      res.status(404).json({
        "error": "Not Found"
      });
    })
});

router.get("/topairing", async (req, res) => {
  const page = req.query.p
  await api.topaired({ page: page }).then(topairing => {
    res.status(200).json({
      topairing
    });
  }).catch(() => {
    res.status(404).json({
      "error": "Not Found"
    });
  })
})

router.get('/search', (req, res) => {
  const query = req.query.q;
  api.search(query)
    .then(search => {
      res.status(200).json({
        search
      });
    })
    .catch(() => {
      res.status(404).json({
        "error": "Not Found"
      });
    })
});

router.get('/anime', (req, res) => {
  res.status(200).json({
    anime_info: "anime/info/:id",
    anime_episode: "anime/episode/:id"
  });
})

router.get('/anime/episode/:id', async (req, res) => {
  const id = req.params.id;
  await api.animeEpisodeHandler(id)
    .then(anime => {
      res.status(200).json({
        anime: anime[0],
      });
    })
    .catch(() => {
      res.status(404).json({
        "error": "Episode Not Found"
      });
    })
});

router.get("/decodeurl/:id", async (req, res) => {
  const id = req.params.id
  await api.getHls({ id: id })
    .then(hls => {
      res.status(200).json({
        hls
      });
    })
    .catch(() => {
      res.status(404).json({
        "error": "Not Found"
      });
    })
});

router.get("/stream/play", async (req, res) => {
  const id = req.query.id
  try {
    const hls = await api.getHls({ id: id })
    const ifr = await api.getIframe(id)
    if (hls.error) {
      res.status(200).json({
        url: ifr[0].servers[0].iframe,
        id: id.split("-episode-")[0],
        episode: id.split("-episode-")[1]
      })
    }
    else {
      res.status(200).json({
        url: `https://player.nscdn.ml/player.html?p=${base64encode('&file=' + hls.sources[0].file)}`,
        id: id.split("-episode-")[0],
        episode: id.split("-episode-")[1]
      })
    }
  } catch (error) {
    res.status(404).json({
      "error": "Not Found"
    })
  }
})

router.get("/stream/iframe/:id", async (req, res) => {
  const id = req.params.id
  await api.getIframe(id)
    .then(iframe => {
      res.status(200).json(
        iframe[0]
      );
    })
    .catch(() => {
      res.status(404).json({
        "error": "Not Found"
      });
    })
})

router.get('/anime/info/:id', (req, res) => {
  const id = req.params.id;
  api.animeInfo(id)
    .then(anime => {
      res.status(200).json(anime[0]);
    })
    .catch(() => {
      res.status(404).json({
        "error": "Episode Not Found"
      });
    })
});

router.get('/recentrelease/:page', (req, res) => {
  const page = parseInt(req.params.page, 10);
  api.recentReleaseEpisodes(page)
    .then(anime => {
      res.status(200).json({
        anime
      });
    })
    .catch(() => {
      res.status(404).json({
        "error": "Not Found"
      });
    })
});

router.get('/recentseries', (req, res) => {
  api.recentlyAddedSeries()
    .then(anime => {
      res.status(200).json({
        anime
      });
    })
    .catch(() => {
      res.status(404).json({
        "error": "Not Found"
      });
    })
});

router.get('/ongoing', (req, res) => {
  api.ongoingSeries()
    .then(anime => {
      res.status(200).json({
        anime
      });
    })
    .catch(() => {
      res.status(404).json({
        "error": "Not Found"
      });
    })
});

router.get('/comment/:id', (req, res) => {
  const id = req.params.id;
  if (id) {
    res.redirect(`https://disqus.com/embed/comments/?base=default&f=gogoanimetv&t_u=https%3A%2F%2Fgogoanime.vc%2F${id}&s_o=default#version=cfefa856cbcd7efb87102e7242c9a829`)
  }
  else {
    res.status(404).json({
      "error": "Not Found"
    })
  }
})

router.get('/alphabet/:letter/:page', (req, res) => {
  const letter = req.params.letter.toUpperCase();
  const page = parseInt(req.params.page, 10);
  api.alphabetList(letter, page)
    .then(anime => {
      res.status(200).json({
        anime
      });
    })
    .catch(() => {
      res.status(404).json({
        "error": "Not Found"
      });
    })
});

router.get('/newseasons/:page', (req, res) => {
  const page = parseInt(req.params.page, 10);
  api.newSeasons(page)
    .then(anime => {
      res.status(200).json({
        anime
      });
    })
    .catch(() => {
      res.status(404).json({
        "error": "Not Found"
      });
    })
});

router.get('/movies/:page', (req, res) => {
  const page = parseInt(req.params.page, 10);
  api.movies(page)
    .then(movies => {
      res.status(200).json({
        movies
      });
    })
    .catch(() => {
      res.status(404).json({
        "error": "Not Found"
      });
    })
});

router.get('/popular/:page', (req, res) => {
  const page = parseInt(req.params.page, 10);
  api.popular(page)
    .then(popular => {
      res.status(200).json({
        popular
      });
    })
});

router.get('/genre/:genre/:page', (req, res) => {
  const genre = req.params.genre;
  const page = parseInt(req.params.page, 10);
  api.genres(genre, page)
    .then(anime => {
      res.status(200).json({
        anime
      });
    })
    .catch(() => {
      res.status(404).json({
        "error": "Not Found"
      });
    })
});

router.get('/decodeurl', (req, res) => {
  const url = req.query.url;
  api.decodevidstream(url)
    .then(urls => {
      res.status(200).json({
        urls
      });
    })
    .catch((err) => {
      res.status(404).json({
        "error": "Not Found",
        err
      });
    })
});

module.exports = router;
