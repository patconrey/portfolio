const jimp = require("jimp")
const fs = require('fs')
const filter = require("lodash/filter")

const imagePath = "./img"
const processedSuffix = "_blur"
const blurConstant = 25

const getFileExtension = fileName => fileName.split(".")[1]
const getFileNameWithoutExtension = fileName => fileName.split(".")[0]

const getImageFiles = () => {
    const fileNames = fs.readdirSync(imagePath)

    const imageFileNames = filter(fileNames, name => {
        const extension = getFileExtension(name)
        return extension === "jpg" || extension === "png"
    })

    console.warn(`There are ${imageFileNames.length} files.`)

    return imageFileNames
}

const scaleAndBlurImage = async fileName => {
    try {

        const imageName = getFileNameWithoutExtension(fileName)
        const image = await jimp.read(`${imagePath}/${fileName}`)
        
        const fileExtension = getFileExtension(fileName)
        const newFilePath = `${imagePath}/${imageName}${processedSuffix}.${fileExtension}`
        
        image.blur(blurConstant, () => console.log(`Processed: ${fileName} -> ${newFilePath}`))
        image.resize(250, jimp.AUTO)
        image.write(newFilePath)
    } catch (error) {
        console.error("Error manipulating image: ", error.message)
    }
}

const removeAllBluredImages = imageFileNames => {
    const imagesToBeRemoved = filter(imageFileNames, name => /^^\S*_blur{1,}.(jpg|png)$/.test(name))

    console.warn(`Will remove ${imagesToBeRemoved.length} images.`)
    imagesToBeRemoved.forEach(imageName => {
        const pathToImage = `${imagePath}/${imageName}`
        try {
            fs.unlinkSync(pathToImage)
            console.warn("Removed ", pathToImage)
        } catch (error) {
            console.error("Error removing file: ", error.message)
        }
    })
}

const main = async () => {
    try {
        const imageFileNames = getImageFiles()
        removeAllBluredImages(imageFileNames)
        await imageFileNames.forEach(async fileName => {
            await scaleAndBlurImage(fileName)
        });
    } catch (error) {
        console.error(error.message)
    }
}

main()
