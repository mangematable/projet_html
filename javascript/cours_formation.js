
console.log("JS chargé");

function filter(type, element) {
    const rows = document.querySelectorAll(".row:not(.header)");
    const buttons = document.querySelectorAll(".filters button");

    buttons.forEach(btn => btn.classList.remove("active"));
    element.classList.add("active");

    rows.forEach(row => {
        if (type === "all" || row.dataset.type === type) {
            row.style.display = "grid";
        } else {
            row.style.display = "none";
        }
    });
}