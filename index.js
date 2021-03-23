/**
 * www.free-stock-music.com的音乐爬虫
 * 获取数据并存入data.json
 */

import superagent from 'superagent';
import cheerio from 'cheerio';
import fs from 'fs';

const baseUrl = "https://www.free-stock-music.com/"

let startPage = 1;  // 开始爬取的页面
let stopPage = 10;   // 结束爬取的页面，值为0则不限制
let pageCount = startPage;
let isExit = false;
let dataCount = 0;

function start(url) {
    // 获取数据
    superagent.get(url).then(res => {
        let audioSrc = [];
        const $ = cheerio.load(res.text);
        // 找到元素后开始遍历
        $("#mainCont .musicCont").each((index, el) => {
            if ($(el).find("audio").attr("src") != undefined) {
                let src = $(el).find("audio").attr("src");
                audioSrc.push({
                    title: $(el).find(".mTitle").text(),
                    file_name: src.replace('music/', ''),
                    file_path: src,
                    src: baseUrl + src
                })
            }
        })
        return audioSrc;
    }).then(audioSrc => {
        if (audioSrc.length == 0) isExit = true;

        // 把爬到的数据记录到文件
        fs.readFile('./data.json', (readErr, fileData) => {
            if (readErr) console.log("文件读取失败", readErr);
            let fileObject = [];
            if (fileData.toString() != '') {
                fileObject = JSON.parse(fileData);
            }
            let finalData = fileObject.concat(audioSrc);
            fs.writeFile('./data.json', JSON.stringify(finalData), { encoding: 'utf-8' }, e => { })
            dataCount += audioSrc.length;
        })

        console.log('\x1B[47m%s\x1B[0m', `已爬取第${pageCount}页，本次获得了${audioSrc.length}条数据`);
        pageCount++;    // 加页数

        // 递归
        if (stopPage != 0 && isExit == false && pageCount <= stopPage) return start(`${baseUrl}page-${pageCount}.html`);
        if (isExit == false) return start(`${baseUrl}page-${pageCount}.html`);
        console.log('\x1B[47m%s\x1B[0m', `所有任务已完成，获得了${dataCount + audioSrc.length}条数据`);
    }).catch(e => {
        isExit = true;
        console.log("出错了：", e);
    })
}

start(`${baseUrl}page-${startPage}.html`)