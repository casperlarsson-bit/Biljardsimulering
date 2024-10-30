// Make the instruction menu hideable
let coll = document.getElementsByClassName("ui")

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active")
        var content = this.nextElementSibling
        if (content.style.display === "block") {
            content.style.display = "none"
        }
        else {
            content.style.display = "block"
        }
    })
}
coll[0].click() // GUI button "lags", an attempt to fix
coll[0].click()