exports.generateEncryptAjaxParameters = generateEncryptAjaxParameters;
exports.decryptEncryptAjaxResponse = decryptEncryptAjaxResponse;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENCRYPTION_KEYS_URL = "https://raw.githubusercontent.com/justfoolingaround/animdl-provider-benchmarks/master/api/gogoanime.json";

// eslint-disable-next-line no-unused-vars
var bkenc = {"key": "37911490979715163134003223491201", "second_key": "54674138327930866480207815084989", "iv": "3134003223491201"}

var iv = null;
var key = null;
var second_key = null;

var fetch_keys = async function fetch_keys() {
  var response = await _axios2.default.get(ENCRYPTION_KEYS_URL);
  var res = response.data;
  return {
    iv: _cryptoJs2.default.enc.Utf8.parse(res.iv),
    key: _cryptoJs2.default.enc.Utf8.parse(res.key),
    second_key: _cryptoJs2.default.enc.Utf8.parse(res.second_key)
  };
};
async function generateEncryptAjaxParameters($, id) {

  var keys = await fetch_keys();
  iv = keys.iv;
  key = keys.key;
  second_key = keys.second_key;

  // encrypt the key
  var encrypted_key = _cryptoJs2.default.AES['encrypt'](id, key, {
    iv: iv
  });

  var script = $("script[data-name='episode']").data().value;
  var token = _cryptoJs2.default.AES['decrypt'](script, key, {
    iv: iv
  }).toString(_cryptoJs2.default.enc.Utf8);

  return 'id=' + encrypted_key + '&alias=' + id + '&' + token;
}

function decryptEncryptAjaxResponse(obj) {
  var decrypted = _cryptoJs2.default.enc.Utf8.stringify(_cryptoJs2.default.AES.decrypt(obj.data, second_key, {
    iv: iv
  }));
  return JSON.parse(decrypted);
}