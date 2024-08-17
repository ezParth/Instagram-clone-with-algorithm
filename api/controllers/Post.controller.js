import sharp from "sharp";

export const addNewPost = async (req, res) => {
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id; // we are getting this from the isAuthenticated middleware.
        if(!image){
            return res.status(401).json({
                message: "Image required!"
            })
        }
        //image upload using sharp
        console.log("Image: ",image);
        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width: 800, height: 800, fit:'inside'})
        .toFormat('jpeg', {quality: 80})
        .toBuffer();
        console.log("image buffer", optimizedImageBuffer)

        //converting image to data uri
        const fileUri= `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        console.log("fileUri", fileUri)


    } catch (error) {
        console.log("Error adding the Post", error);
    }
}