"use strict";
function getURLCallback(URL, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', URL, false);
    req.onload = function () {
        if (req.status == 200) {
            callback(null, req.response);
        } else {
            callback(new Error(req.statusText), req.response);
        }
    };
    req.onerror = function () {
        callback(new Error(req.statusText));
    };
    req.send();
}

function jsonParse(callback, error, value) {
    if (error) {
        callback(error, value);
    } else {
        try {
            var result = JSON.parse(value);
            callback(null, result);
        } catch (e) {
            callback(e, value);
        }
    }
}
var request = {
    comment: function getComment(callback) {
        return getURLCallback('http://azu.github.io/promises-book/json/comment.json', jsonParse.bind(null, callback));
    },
    people: function getPeople(callback) {
        return getURLCallback('http://azu.github.io/promises-book/json/people.json', jsonParse.bind(null, callback));
    }
};
function main(callback) {
    function requester(requests, callback, results) {
        if (requests.length === 0) {
            return callback(null, results);
        }
        var req = requests.shift();
        req(function (error, value) {
            if (error) {
                callback(error, value);
            } else {
                results.push(value);
                requester(requests, callback, results);
            }
        });
    }
    requester([request.comment, request.people], callback, []);
}

module.exports.main = main;
module.exports.request = request;