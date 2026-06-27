export default class Scroller {
  private observer: IntersectionObserver | null = null;
  private readonly options: { rootMargin: string };

  // arrow function で this を自動バインド
  private readonly _handleIntersection = (entries: IntersectionObserverEntry[]): void => {
    for (const entry of entries) {
      const target = entry.target as HTMLElement;
      if (entry.isIntersecting && target.classList.contains('waiting')) {
        const delay = parseInt(target.dataset.delay || '0', 10);
        setTimeout(() => {
          target.classList.add('animated');
          target.classList.remove('waiting');
        }, Math.max(0, delay));
        this.observer?.unobserve(target);
      }
    }
  };

  static animationStart(container: HTMLElement | string): void {
    const containerEl = typeof container === 'string'
      ? document.querySelector<HTMLElement>(container)
      : container;
    if (!containerEl) return;

    containerEl.querySelectorAll<HTMLElement>('.wait').forEach(element => {
      const delay = parseInt(element.dataset.delay || '0', 10);
      setTimeout(() => {
        element.classList.remove('wait');
        element.classList.add('animation');
      }, delay);
    });
  }

  static resetAnimate(container: HTMLElement | string): void {
    const containerEl = typeof container === 'string'
      ? document.querySelector<HTMLElement>(container)
      : container;
    if (!containerEl) return;

    containerEl.querySelectorAll<HTMLElement>('.animation').forEach(el => {
      el.classList.add('wait');
      el.classList.remove('animation');
    });
    containerEl.querySelectorAll<HTMLElement>('.animated').forEach(el => {
      el.classList.add('waiting');
      el.classList.remove('animated');
    });
  }

  constructor(options: { rootMargin?: string } = {}) {
    this.options = { rootMargin: options.rootMargin ?? '0px 0px -20% 0px' };
  }

  start(): void {
    this.stop();
    this.observer = new IntersectionObserver(this._handleIntersection, {
      root: null,
      rootMargin: this.options.rootMargin,
      threshold: 0,
    });
    document.querySelectorAll<HTMLElement>('.waiting').forEach(target => {
      this.observer!.observe(target);
    });
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
