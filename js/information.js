document.addEventListener("DOMContentLoaded", function () {
  // Ambil seluruh element header di dalam info-box yang bertindak sebagai accordion
  const accordionHeaders = document.querySelectorAll(
    ".accordion-item .info-box-header",
  );

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const parentItem = this.parentElement;

      parentItem.classList.toggle("active");
    });
  });
});
