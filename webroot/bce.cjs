const URL = require('url');
const axios = require('axios').default;

const storage = {
    token: '',
    config: new URL.URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': 'your-bce-appid',
        'client_secret': 'your-bce-appkey'
    })
};

async function getToken() {

    const url = 'https://aip.baidubce.com/oauth/2.0/token?';

    let info = await axios.post(url + storage.config.toString());

    return info && info.data;

}

async function getSelfie(image) {

    if (storage.token === '') {
        const { access_token } = await getToken();
        if (access_token) {
            storage.token = 'access_token=' + access_token;
        }
    }

    const url = 'https://aip.baidubce.com/rest/2.0/image-process/v1/selfie_anime?' + storage.token;

    const params = new URL.URLSearchParams({ image });

    let info = await axios.post(url, params.toString());

    return info && info.data;

}


module.exports = function (input, next) {

    getSelfie(input.postData.image).then(data => {
        next({ file: 'hello', data }, 200);
    });

};
