const lazyBackgroundImages = [...document.querySelectorAll(".lazy-background-image")]
const lazyLoadBackgroundImages = () => {
    lazyBackgroundImages.forEach((image) => {
        const fullSizeImageUrl = image.dataset.src
        image.style.backgroundImage = `url('${fullSizeImageUrl}')`
    })
}

const lazyImages = [...document.querySelectorAll(".lazy-image")]
const lazyLoad = () => {
    const inAdvance = 0
    lazyImages.forEach((image, index) => {
        if (image.offsetTop < window.innerHeight + window.pageYOffset + inAdvance) {
            image.src = image.dataset.src
            image.classList.remove("lazy-image")
            delete lazyImages[index]
        }
    });
}

const loadTypeFaces = () => {
    let root = document.documentElement
    root.style.setProperty("--font-serif", "Merriweather")
    root.style.setProperty("--font-sans", "Open Sans")
}

lazyLoad()
lazyLoadBackgroundImages()
loadTypeFaces()

window.addEventListener("scroll", lazyLoad)