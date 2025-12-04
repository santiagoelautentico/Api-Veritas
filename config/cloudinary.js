import { v2 as cloudinary } from 'cloudinary';
//-----------------------------------------------------------------------------------------------------
console.log('🔑 CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('🔑 CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('🔑 CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Existe' : '❌ NO existe');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const urlTry = cloudinary.url('desktop-wallpaper-okita-sougo_g1lc7o')

console.log(urlTry);

export { cloudinary };
