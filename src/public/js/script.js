const colorInput = document.querySelector('input[type="color"]');
const preview = document.querySelector(".color-preview");

preview.style.background = colorInput.value;

colorInput.addEventListener("input", () => {
  preview.style.background = colorInput.value;
});
