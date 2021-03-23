# free-stock-music.com 爬虫
爬取[www.free-stock-music.com](http://www.free-stock-music.com)网站上的音乐

Download [www.free-stock-music.com](http://www.free-stock-music.com)`s Music

### 1.安装依赖（Install Dependencies）

```shell
npm i
```

### 2.修改配置（Change Config）
修改**index.js**文件中如下代码块的数值
```javascript
let startPage = 1;  // 开始爬取的页面(start page count)
let stopPage = 10;  // 结束爬取的页面，值为0则不限制(stop page count，0 is unlimited)
```

### 3.开始爬取（Start Get Data）
```shell
node index.js
```

OR

```shell
npm run start
```



爬取中会有进度显示，所有页面爬取完成后也会提示。

### 4.开始下载获得的数据（Start Download Music）

```shell
node download.js
```

OR

```shell
npm run start:download
```





下载时会有进度条显示，下载完的音乐文件会保存在根目录下的**downloads**目录里

（Download complete, The file is saved in the **downloads** directory ）

![image-20210323191022713](C:\Users\WeicMa\AppData\Roaming\Typora\typora-user-images\image-20210323191022713.png)