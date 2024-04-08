export default function decorate(block) {
  const slides = [...block.children];
  const slideCount = slides.length;
  let currentIndex = 0;
  let interval;
  let touchStartX = 0;

  // Add CSS class to all child elements to style them
  slides.forEach((element, index) => {
    element.classList.add('hero-carousel-slide');
    if (index === 0) {
      element.classList.add('active');
    }
  });

  const dotsContainer = document.createElement('div');

  // Function to update the active dot
  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Function to navigate to a specific slide
  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    currentIndex = index;
    slides[currentIndex].classList.add('active');
    updateDots();
  }

  // Function to show the next slide
  function showNextSlide() {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slideCount;
    slides[currentIndex].classList.add('active');
    updateDots();
  }

  // Create dots for each slide
  dotsContainer.classList.add('carousel-dots');
  for (let i = 0; i < slideCount; i += 1) {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    dot.addEventListener('click', () => {
      goToSlide(i);
    });
    if (i === 0) {
      dot.classList.add('active');
    }
    dotsContainer.appendChild(dot);
  }
  block.appendChild(dotsContainer);

  // Touch event handling
  block.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  block.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    // If the touch ends to the right of the starting position, move to the previous slide
    if (deltaX > 50 && currentIndex > 0) {
      goToSlide(currentIndex - 1);
      clearInterval(interval);
      interval = setInterval(showNextSlide, 7000);
    } else if (deltaX < -50 && currentIndex < slideCount - 1) {
      goToSlide(currentIndex + 1);
      clearInterval(interval);
      interval = setInterval(showNextSlide, 7000);
    }
  });

  // Start the automatic slide transition
  interval = setInterval(showNextSlide, 7000); // Change slide every 7 seconds

  // Pause the automatic transition when a user hovers over the carousel
  block.addEventListener('mouseenter', () => {
    clearInterval(interval);
  });

  // Resume the automatic transition when a user leaves the carousel
  block.addEventListener('mouseleave', () => {
    interval = setInterval(showNextSlide, 7000);
  });
}
