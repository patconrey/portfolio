<script>
    const navBar = document.getElementById("top-nav");
    window.addEventListener("scroll", function (event) {
        if (this.scrollY > (300 * 2)) {
            navBar.classList.add("top-nav--white");
        }
        else {
            navBar.classList.remove("top-nav--white");
        }
    })
    </script>