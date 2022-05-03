# node_week3

## node 實作練習
- 實作 express MVC 架構建立 RESTful API
- 實作 posts API，路由 `/posts`
  - GET:  '/posts'
  - POST: '/posts'
  - DELETE: '/posts'
  - DELETE: '/posts/:id'
  - PATCH: '/posts/:id'
  - OPTIONS: 預檢請求
- 串接 MongoDB Cloud - atlas
- 新增 dotenv 環境變數檔
- 部屬至 Heroku Cloud server
- 將 collection Model 獨立拉至 `/model` 路徑下
- 拆分 routers, controllers

## 環境變數
請修改 example.env 檔案，請自行修改：
- DATABASE：mongoDB atlas connection URL，記得<資料庫名稱>自行設定
- DATABASE_PASSWORD：自己的password

## 指令
- npm start：啟動伺服器
- nodemon bin/www：開發時使用

## Server 進入點
- bin/www
