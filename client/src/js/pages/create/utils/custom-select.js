export function select() {
    document.querySelectorAll(".custom-dropdown").forEach(drop => {
        const selected = drop.querySelector(".selected");
        const options = drop.querySelector(".options");
        const hiddenInput = drop.querySelector("input[type='hidden']");

        selected.addEventListener('click', () => {
            drop.classList.toggle("open");
        });

        options.querySelectorAll(".option").forEach(opt => {
            opt.addEventListener("click", () => {
                selected.textContent = opt.textContent;
                hiddenInput.value = opt.textContent;
                drop.classList.remove("open");
            });
        });

        document.addEventListener("click", (e) => {
            if (!drop.contains(e.target)) {
                drop.classList.remove("open");
            }
        });
    });
}