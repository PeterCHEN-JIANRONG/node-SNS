# node_final

實作：社群網站 SNS
功能：
- 會員功能
  - 註冊、登入、重設密碼、取得個人資料、更新個人資料
- 會員按讚追蹤動態
  - 追蹤、取消追蹤、取得個人按讚列表、取得個人追蹤名單
- 動態貼文
  - 取得所有貼文、取得個人貼文、取得單一貼文
  - 新增貼文、新增一則貼文讚、取消一則貼文讚、新增一則貼文

## node 先前的實作練習

### node_week7
- 串接第三方圖床 [imgru](https://imgur.com/ "第三方圖床")，[教學文件](https://israynotarray.com/nodejs/20220517/432259079/)
- 設計 /upload 路由，上傳圖片功能
- 後端需驗證是否符合 2mb 限制、格式支援 jpg、png
- 通過 isAuth 登入驗證 middleware，才可上傳圖片

### node_week6
- 實作 JWT驗證登入/註冊功能
- 驗證身分 isAuth middleware
- 增加身分驗證，實作：
  - 註冊、登入
  - 密碼重設
  - 取得個人資料
  - 更新更人資料
  - 新增貼文
  - 查詢所有貼文

### week5
- 請設計一個 middleware，讓 controller 程式碼裡面沒有 try catch
- 請透過環境變數執行指令加上 dev、production 的客製化回饋
- 承第二點，請觀看此[張圖](https://whimsical.com/NJzhqQpRX1YcogzPz6ro5e "自訂錯誤")，確保你的後端語言有客製化各種錯誤狀態，包含 NPM 的錯誤訊息客製化
- 請透過 node.js uncaughtException、unhandledRejection 來捕捉預期外的錯誤

### week4
- 實作關聯式資料：
  - post 貼文: user field -> ObjectId, 關聯 users collection
  - user 使用者
- 實作 express MVC 架構建立 RESTful API
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
- *npm start*：啟動伺服器
- *npm run dev*：開發時使用

## Server 進入點
- bin/www
