const axios = require("axios");

const apiUtils = {
    async getNaverShopData (keywordList) {
        const client_id = "dQL9g9JZCVfWsHNACgOq";
        const client_secret = "hbsA4OfuuL";
        const api_url = "https://openapi.naver.com/v1/search/shop.json?display=100&start=1&query=";
        let shopDataList = [];
        for (const keyword of keywordList) {
            let response = await axios.get(api_url + encodeURI(keyword), {
                headers: {
                    "X-Naver-Client-Id": client_id,
                    "X-Naver-Client-Secret": client_secret
                }
            })
            shopDataList.push([keyword, JSON.stringify(response.data.items)]);
        }

        return shopDataList;
    },
}

module.exports = apiUtils;