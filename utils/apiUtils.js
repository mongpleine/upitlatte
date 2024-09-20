const axios = require("axios");
const moment = require('moment');

const apiUtils = {
    async getNaverShopData (keywordList) {
        const client_id = "dQL9g9JZCVfWsHNACgOq";
        const client_secret = "hbsA4OfuuL";
        const api_url = `https://openapi.naver.com/v1/search/shop.json?display=${config.rank_limit}&start=1&query=`;
        let shopDataList = [];
        let today = moment(new Date()).format('YYYY-MM-DD');
        for (const keyword of keywordList) {
            let response = await axios.get(api_url + encodeURI(keyword), {
                headers: {
                    "X-Naver-Client-Id": client_id,
                    "X-Naver-Client-Secret": client_secret
                }
            })
            shopDataList.push([keyword, JSON.stringify(response.data.items), today]);
        }

        return shopDataList;
    },
    async checkEIDFromOdcloud (context) {
        const serviceKey = "et3%2FqL%2BkKaQq9gDstOLZbfcLqU%2BiqH%2B5Zz73XQcwA2%2FVjEgo%2BCa2PUQcRj%2Fp%2FKlpZSUnCugPUSuWlopVaB1dKg%3D%3D";
        const api_url = "https://api.odcloud.kr/api/nts-businessman/v1/status";
        let response = await axios.post(`${api_url}?serviceKey=${serviceKey}`, {
            b_no: [
                String(context.data.eid)
            ]
        })
        context.eidMatch = "match_cnt" in response.data ? response.data.match_cnt : false;
        return context;
    }
}

module.exports = apiUtils;