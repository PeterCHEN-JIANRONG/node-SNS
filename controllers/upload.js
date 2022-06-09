const appError = require("../services/appError");
const { successHandle } = require("../services/httpHandle");
const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');

const controller = {
  async uploadImages(req,res,next){

    if(!req.files.length){
      return appError(next,"尚未上傳檔案")
    }

    // if(req.files.length > 8){
    //   return appError(next,"上傳圖片超過 8 張")
    // }

    // 限制圖片比例
    // const dimensions = sizeOf(req.files[0].buffer);
    // if(dimensions.width !== dimensions.height) {
    //   return appError(next, "圖片長寬不符合 1:1 尺寸。")
    // }

    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });

    const imagesData = [];
    for(let i in req.files){
      // 單張圖片上傳
      const imgurRes = await client.upload({
        image: req.files[i].buffer.toString('base64'), // 圖片轉 base64 格式
        type: 'base64',
        album: process.env.IMGUR_ALBUM_ID
      });
      imagesData.push(imgurRes.data.link);
    }
    successHandle(res,imagesData);
  }
}

module.exports = controller