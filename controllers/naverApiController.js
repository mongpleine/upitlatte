const db = require("../models/database/mysqlSetting").connection;
const getConnection = require("../models/database/connectionPool");
const axios = require('axios');
const bcrypt = require('bcrypt');
const http = require("https");

const controller = {
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
    },

    getShoppingData(req, res, next) {
        let context = {
            data: {
                search: req.query.search,
            }
        }

        try {
            const URL = "https://openapi.naver.com/v1/search/shop.json"; //URL이 이상하다고 생각하실겁니다! 아래에 계속 됩니다!
            const clientId = "2Qmg3rpsQWMCUKNsRHg253";
            const clientSecret = "$2a$04$ryStHSrEKdImVI7/8eO.UO";
            const timestamp = new Date().getTime();

            const password = `${clientId}_${timestamp}`;
            const hashed = bcrypt.hashSync(password, clientSecret);
            console.log(Buffer.from(hashed, "utf-8").toString("base64"));
            const options = {
                "method": "GET",
                "hostname": "api.commerce.naver.com",
                "port": null,
                "path": "/external/v1/categories",
                "headers": {
                    "Authorization": "1xPDiGuYpmSZZeGzaVJEDn"
                }
            };

            const request = http.request(options, function (response) {
                const chunks = [];

                response.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                response.on("end", function () {
                    const body = Buffer.concat(chunks);
                    console.log(body.toString());
                });
            });

            request.end();

            res.send("");
        } catch (err) {
            next(err);
        }
    },
}

module.exports = controller;