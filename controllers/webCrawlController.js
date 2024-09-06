const db = require("../models/database/mysqlSetting").connection;
const userModel = require("../models/userModel");
const coupangModel = require("../models/coupangModel");
const getConnection = require("../models/database/connectionPool");
const axios = require('axios');
// const cheerio = require('cheerio');
const fs = require('fs');

const coupangUrl = "https://www.coupang.com/";

const controller = {
    // centos7 && node18 호환성 문제로 비활성화
    // getCoupangCategory(req, res, next) {
    //     let context = {};
    //     try {
    //         // api 접근 시 쿠팡에서 차단, 사이트 접속으로 얻은 html 파일을 임시로 사용함
    //         const html = fs.readFileSync(__dirname + '/../views/html/coupangMain.html', 'utf8');
    //         // const html = await axios.get(coupangUrl);
    //         const $ = cheerio.load(html);
    //         const $bodyList = $('div.category-layer-for-ingress-C li');
    //         let liList = [];
    //         $bodyList.each(function (i, elem) {
    //             liList[i] = [
    //                 $(this).find('a').text().split("\n")[0],
    //                 $(this).find('a').attr('href') || ''
    //             ]
    //         });
    //
    //         const data = liList.filter(n => {
    //             return n[1] !== "javascript:;";
    //         });
    //
    //         getConnection((conn) => {
    //             context.conn = conn;
    //
    //             context.data = data;
    //             coupangModel.setCategories(context, context.data)
    //                 .then(context => {
    //                     context.conn.release();
    //                     return context;
    //                 })
    //                 .then(context => {
    //                     res.json({message: "success"})
    //                 });
    //         })
    //     } catch (err) {
    //         next(err);
    //     }
    // },

    getCoupangLank(req, res, next) {
        let context = {
            data: {
                category: req.body.category
            }
        }

        try {
            const html = axios.get(coupangUrl + context.data.category);
            getConnection((conn) => {
                context.conn = conn;
            });
        } catch (err) {
            next(err);
        }
    },

    defaultFunc(req, res, next) {
        let context = {
            data: {}
        }

        try {
            getConnection((conn) => {
                context.conn = conn;
            });
        } catch (err) {
            next(err);
        }
    }

}

module.exports = controller;