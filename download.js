/**
 * www.free-stock-music.com的音乐爬虫
 * 下载存于data.json中的数据
 */

import superagent from 'superagent';
import fs from 'fs';
import progress from 'progress-stream';
import ProgressBar from 'progress';
let green = '\u001b[42m \u001b[0m';
let red = '\u001b[41m \u001b[0m';

let data = [];
let currentDataIndex = 0;

// 读取文件到data变量
let fileData = fs.readFileSync('./data.json', { encoding: 'utf-8' });
if (fileData.length > 0) data = JSON.parse(fileData.toString());

(async function start() {
    // 读取数据
    let item = data[currentDataIndex];
    if (item == undefined) return;

    // 判断文件是否存在
    let fileExisted = fs.existsSync('./downloads/' + item.file_name);
    if (fileExisted) {
        console.log(`《${item.title}》已存在，即将跳过下载`);
        // 递归
        currentDataIndex++;
        return start();
    }

    // 发送请求
    let streamProgress = progress({ time: 100 })
    const bar = new ProgressBar(':bar :percent', {
        complete: green,
        incomplete: red,
        total: 100
    });
    streamProgress.on('progress', function (p) {
        let currentProgress = p.percentage / 100;
        bar.update(currentProgress)
        bar.tick()
    });
    
    let writeStream = fs.createWriteStream('./downloads/' + item.file_name, { encoding: 'binary' });
    await superagent.get(item.src)
        .on('response', (res => { streamProgress.setLength(res.body.length) }))
        .pipe(streamProgress)
        .pipe(writeStream)
   
    writeStream.on('ready', () => {
        console.log(`《${item.title}》开始下载`);
        if (currentDataIndex < data.length) currentDataIndex++;
    })
    writeStream.on('finish', () => {
        console.log(`《${item.title}》下载完成`);
        // 递归
        if (currentDataIndex < data.length) {
            currentDataIndex++;
            start();
        } else {
            console.log('\x1B[47m%s\x1B[0m', '所有下载任务已完成');
        }
    })
})()