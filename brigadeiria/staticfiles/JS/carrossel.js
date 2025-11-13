let slideIndex = 0;
showSlides();

function showSlides() {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  // Se não houver slides, sai da função (evita erro no console)
  if (slides.length === 0) return;

  slides.forEach(slide => (slide.style.display = "none"));
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  slides[slideIndex - 1].style.display = "block";

  dots.forEach(dot => dot.classList.remove("active"));
  dots[slideIndex - 1].classList.add("active");

  setTimeout(showSlides, 4000); // muda a cada 4 segundos
}
