const colorInput = document.querySelector('input[type="color"]');
const preview = document.querySelector(".color-preview");

preview.style.background = colorInput.value;

colorInput.addEventListener("input", () => {
  preview.style.background = colorInput.value;
});

function filterType(type) {
  const cards = document.querySelectorAll(".transaction-card");

  cards.forEach((card) => {
    if (type === "all") {
      card.style.display = "flex";
    } else {
      card.style.display = card.dataset.type === type ? "flex" : "none";
    }
  });

  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");
}


