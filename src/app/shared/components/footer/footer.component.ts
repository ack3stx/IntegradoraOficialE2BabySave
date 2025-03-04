import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  scrollToSection(event: Event, id: string) {
    event.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      this.smoothScroll(section.offsetTop - 50, 300); 
    }
  }

  smoothScroll(targetY: number, duration: number) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime: number | null = null;

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeInOut = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, startY + distance * easeInOut);

      if (elapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    requestAnimationFrame(animation);
  }
}
