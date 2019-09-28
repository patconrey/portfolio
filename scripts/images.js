const jimp = require("jimp")
const fs = require('fs')
const filter = require("lodash/filter")

const imagePath = "./img"
const blurredSuffix = "_blur"
const scaledSuffix = "_scaled"
const blurConstant = 25
const maximumAllowedDimension = 1000

const getFileExtension = fileName => fileName.split(".")[1]

const getFileNameWithoutExtension = fileName => fileName.split(".")[0]

const getImageFiles = () => {
    const fileNames = fs.readdirSync(imagePath)
    const imageFileNames = filter(fileNames, name => {
        const extension = getFileExtension(name)
        return extension === "jpg" || extension === "png"
    })
    console.warn(`There are ${imageFileNames.length} image files to consider.`)

    return imageFileNames
}

const scaleAndBlurImage = async fileName => {
    try {
        const pathToImage = `${imagePath}/${fileName}`
        const imageName = getFileNameWithoutExtension(fileName)
        const imageExtension = getFileExtension(fileName)
        const image = await jimp.read(pathToImage)

        const imageHeight = image.bitmap.height
        const imageWidth = image.bitmap.width
        const largestImageDimension = imageHeight > imageWidth
            ? imageHeight
            : imageWidth
        
        if (largestImageDimension > maximumAllowedDimension) {
            try {
                const imageScaleFactor = parseFloat((maximumAllowedDimension / largestImageDimension).toFixed(2))
                console.log(`Scaling original ${pathToImage} by ${imageScaleFactor}`)
                image.scale(imageScaleFactor)

                const scaledFilePath = `${imagePath}/${imageName}${scaledSuffix}.${imageExtension}`
                image.write(scaledFilePath)
            } catch (error) {
                console.error("⚠️  Error scaling original image: ", error.message)
            }
        }
        
        try {
            image.resize(250, jimp.AUTO)
            const blurredFilePath = `${imagePath}/${imageName}${blurredSuffix}.${imageExtension}`
            image.blur(blurConstant, () => console.log(`Blurring and scaling ${pathToImage} -> ${blurredFilePath}`))
            image.write(blurredFilePath)
        } catch (error) {
            console.error("⚠️  Error blurring and scaling image: ", error.message)
        }
    } catch (error) {
        console.error("⚠️  Error reading image: ", error.message)
    }
}

const removeAllStaleImages = imageFileNames => {
    const imagesToBeRemoved = filter(imageFileNames, name => /^^\S*_blur{1,}.(jpg|png)$/.test(name) || /^^\S*_scaled{1,}.(jpg|png)$/.test(name))
    console.warn(`\n🗑️  Will remove ${imagesToBeRemoved.length} images.`)

    imagesToBeRemoved.forEach(imageName => {
        const pathToImage = `${imagePath}/${imageName}`
        try {
            fs.unlinkSync(pathToImage)
            console.warn("Removed ", pathToImage)
        } catch (error) {
            console.error("⚠️  Error removing file: ", error.message)
        }
    })
}

const main = async () => {
    try {
        console.log("\n🎨 Will begin processing images.\n")

        const allAvailableImageFileNames = getImageFiles()
        removeAllStaleImages(allAvailableImageFileNames)

        console.log("\n🖨️  Scaling and blurring images.")
        const imageFileNamesForProcessing = getImageFiles()
        await imageFileNamesForProcessing.forEach(async fileName => {
            await scaleAndBlurImage(fileName)
        });
    } catch (error) {
        console.error(error.message)
    }
}

main()