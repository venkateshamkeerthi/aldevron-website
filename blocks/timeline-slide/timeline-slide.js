import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const yearSlider = div({ id: 'year-slider' });
  const contentSliderContainer = div({ id: 'content-slider-container' });
  const contentSlider = div({ id: 'content-slider' });
  const nextButton = div({ class: 'button-block' }, div({ class: 'button-next' }));
  const prevButton = div({ class: 'button-block' }, div({ class: 'button-prev' }));
  const buttonContainer = div({ class: 'button-container' });
  let activeYearIndex = 0;
  let touchStartX = 0;

  buttonContainer.appendChild(prevButton);
  buttonContainer.appendChild(nextButton);

  function translateYearSlider() {
    const yearWidth = yearSlider.children[0].offsetWidth;
    const translateDistance = yearWidth * activeYearIndex;
    yearSlider.style.transform = `translate3d(calc( 43% - ${translateDistance}px ), 0px, 0px)`;
  }

  // Function to clear all active classes
  function clearActiveClasses() {
    [...yearSlider.children].forEach((year) => {
      year.classList.remove('active');
    });
    [...contentSlider.children].forEach((content) => {
      content.classList.remove('active');
    });
  }

  function applySlideEffect(index, direction) {
    const content = block.querySelector(`#content-${yearSlider.children[index].textContent.trim()}`);
    if (content) {
      // Apply sliding effect
      content.style.transform = `translateX(${direction === 'left' ? '100%' : '-100%'})`;
      setTimeout(() => {
        content.style.transform = 'translateX(0)';
      }, 50); // Delay to ensure the transition effect is applied
    }
  }

  function slideToRightMouse() {
    // Calculate the next index
    const nextIndex = activeYearIndex + 1;

    if (nextIndex < yearSlider.children.length) {
      // Move to the next year and update the active index
      yearSlider.children[nextIndex].click();
      // yearSlider.children[activeYearIndex].click();
      activeYearIndex = nextIndex;
      // Always show the prev button when moving forward
      prevButton.classList.remove('hide');
      translateYearSlider();
    }

    // Hide the next button if we reach the end
    if (nextIndex === yearSlider.children.length - 1) {
      nextButton.classList.add('hide');
    }
  }

  function slideToLeftMouse() {
    const prevIndex = activeYearIndex - 1;

    if (prevIndex >= 0) {
      // Move to the previous year and update the active index
      yearSlider.children[prevIndex].click();
      activeYearIndex = prevIndex;

      // Always show the next button when moving backward
      nextButton.classList.remove('hide');

      // Translate the year slider
      translateYearSlider();
    }

    // Hide the prev button if we reach the beginning
    if (prevIndex === 0) {
      prevButton.classList.add('hide');
    }
  }

  nextButton.addEventListener('click', () => {
    // Calculate the next index
    const nextIndex = activeYearIndex + 1;

    if (nextIndex < yearSlider.children.length) {
      // Move to the next year and update the active index
      yearSlider.children[nextIndex].click();
      activeYearIndex = nextIndex;
      // Always show the prev button when moving forward
      prevButton.classList.remove('hide');
      translateYearSlider();
    }

    // Hide the next button if we reach the end
    if (nextIndex === yearSlider.children.length - 1) {
      nextButton.classList.add('hide');
    }
  });

  prevButton.addEventListener('click', () => {
    const prevIndex = activeYearIndex - 1;

    if (prevIndex >= 0) {
      // Move to the previous year and update the active index
      yearSlider.children[prevIndex].click();
      activeYearIndex = prevIndex;

      // Always show the next button when moving backward
      nextButton.classList.remove('hide');

      // Translate the year slider
      translateYearSlider();
    }

    // Hide the prev button if we reach the beginning
    if (prevIndex === 0) {
      prevButton.classList.add('hide');
    }
  });

  [...block.children].forEach((child) => {
    if (child.children.length >= 2) {
      const yearChild = child.children[0].cloneNode(true);
      yearChild.classList.add('year');
      yearSlider.appendChild(yearChild);
      const contentChild = child.children[1].cloneNode(true);
      contentChild.classList.add('year-content');
      contentChild.id = `content-${yearChild.innerText}`;
      contentSlider.appendChild(contentChild);
    }
  });

  block.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  block.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    // If the touch ends to the right of the starting position, move to the previous slide
    if (deltaX < 0) {
      slideToRightMouse();
    } else if (deltaX > 0) {
      slideToLeftMouse();
    }
  });

  block.innerHTML = '';
  block.appendChild(yearSlider);
  contentSliderContainer.appendChild(contentSlider);
  contentSliderContainer.appendChild(buttonContainer);
  block.appendChild(contentSliderContainer);
  block.classList.add('clearfix');

  [...yearSlider.children].forEach((year, index) => {
    year.addEventListener('click', () => {
      clearActiveClasses();

      // disable previous arrow button based on first slide.
      if (index === 0 && !prevButton.classList.contains('hide')) {
        prevButton.classList.add('hide');
      } else { prevButton.classList.remove('hide'); }

      // disable next arrow button based on last slide.
      if (index === yearSlider.children.length - 1 && !nextButton.classList.contains('hide')) {
        nextButton.classList.add('hide');
      } else { nextButton.classList.remove('hide'); }

      // Check direction for slide effect
      const direction = index > activeYearIndex ? 'left' : 'right';
      applySlideEffect(index, direction);

      // Update active year
      activeYearIndex = index;

      translateYearSlider();

      year.classList.add('active');
      const contentId = `#content-${year.textContent.trim()}`;
      block.querySelector(contentId).classList.add('active');
    });
  });

  function makeElementActive() {
    yearSlider.children[0].classList.add('active');
    contentSlider.children[0].classList.add('active');
    activeYearIndex = 0;
    prevButton.classList.add('hide');
  }

  makeElementActive();
}
