class Modal {
  private html: HTMLElement;
  private body: HTMLElement;
  private currentModal: HTMLElement | null;

  constructor() {
    this.html = document.querySelector('html') as HTMLElement;
    this.body = document.querySelector('body') as HTMLElement;
    this.currentModal = null;
  }

  init(): void {
    this.body.addEventListener('click', (event: MouseEvent) => {
      const trigger = (event.target as Element).closest('.g-modal--btn');
      if (trigger) {
        this.open(event);
      }
    });
  }

  open(event: MouseEvent): void {
    const trigger = (event.target as Element).closest<HTMLElement>('.g-modal--btn');
    if (!trigger) return;

    const modalId = trigger.dataset.modalId;
    const contentId = trigger.dataset.modalContent;

    if (!modalId || !contentId) {
      console.error('Modal trigger requires data-modal-id and data-modal-content attributes.');
      return;
    }

    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`Modal with id "${modalId}" not found.`);
      return;
    }

    this.currentModal = modal;
    const overlay = modal.querySelector<HTMLElement>('.g-modal-overlay');
    const closeButton = modal.querySelector<HTMLButtonElement>('.g-modal--close');
    const modalWrap = modal.querySelector<HTMLElement>('.g-modal-wrap');
    const content = modal.querySelector<HTMLElement>(`.g-modal-content[data-modal-content="${contentId}"]`);

    if (!content || !overlay || !closeButton || !modalWrap) {
      console.error(`Required modal elements not found in modal "${modalId}".`);
      return;
    }

    this.html.classList.add('is-modal');

    const { modalUrl, modalColor, modalOverlay, modalOpacity, modalYoutube } = content.dataset;

    if (modalUrl) {
      content.style.background = `url(${modalUrl}) center center / 100% 100%`;
    } else if (modalColor) {
      content.style.background = modalColor;
    }

    if (modalYoutube) {
      const movieContainer = content.querySelector('.movie');
      if (movieContainer) {
        movieContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${modalYoutube}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }
    }

    if (modalOverlay) overlay.style.background = modalOverlay;
    if (modalOpacity) overlay.style.opacity = modalOpacity;

    content.classList.add('g-modal-content--open', 'show');
    modal.style.display = 'flex';
    modalWrap.scrollTop = 0;

    const closeHandler = (): void => this.close();
    overlay.addEventListener('click', closeHandler, { once: true });
    closeButton.addEventListener('click', closeHandler, { once: true });
  }

  close(): void {
    if (!this.currentModal) return;

    const modal = this.currentModal;
    const overlay = modal.querySelector<HTMLElement>('.g-modal-overlay');
    const openContent = modal.querySelector<HTMLElement>('.g-modal-content--open');

    if (openContent) {
      const movieContainer = openContent.querySelector('.movie');
      if (movieContainer) movieContainer.innerHTML = '';
      openContent.style.background = '';
      openContent.classList.remove('g-modal-content--open', 'show', 'not-centering');
    }

    modal.style.display = '';
    this.html.classList.remove('is-modal');

    if (overlay) {
      overlay.style.background = '';
      overlay.style.opacity = '';
    }

    this.currentModal = null;
  }
}

export default Modal;
