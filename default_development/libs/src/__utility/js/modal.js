/**
 * Modal Controller
 *
 * How to use:
 *
 * HTML:
 * <button class="modal--btn" data-modal-id="myModal" data-modal-content="content1">Open Modal</button>
 *
 * <div id="myModal" class="g-modal">
 *   <div class="g-modal-overlay"></div>
 *   <div class="g-modal-wrap">
 *     <div class="g-modal-content" data-modal-content="content1" data-modal-youtube="xxxxxxx">
 *       ...
 *     </div>
 *   </div>
 *   <button class="g-modal--close"></button>
 * </div>
 *
 * JS:
 * import Modal from './modal';
 *
 * const modal = new Modal();
 * modal.init();
 *
 */
class Modal {
  constructor() {
    this.html = document.querySelector("html");
    this.body = document.querySelector("body");
    this.currentModal = null;
  }

  init() {
    this.body.addEventListener("click", (event) => {
      const trigger = event.target.closest(".g-modal--btn");
      if (trigger) {
        this.open(event);
      }
    });
  }

  open(event) {
    const trigger = event.currentTarget;
    const modalId = trigger.dataset.modalId;
    const contentId = trigger.dataset.modalContent;

    if (!modalId || !contentId) {
      console.error("Modal trigger requires data-modal-id and data-modal-content attributes.");
      return;
    }

    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`Modal with id "${modalId}" not found.`);
      return;
    }

    this.currentModal = modal;
    const overlay = modal.querySelector(".g-modal-overlay");
    const closeButton = modal.querySelector(".g-modal--close");
    const modalWrap = modal.querySelector(".g-modal-wrap");
    const content = modal.querySelector(`.g-modal-content[data-modal-content="${contentId}"]`);

    if (!content) {
      console.error(`Modal content "${contentId}" not found in modal "${modalId}".`);
      return;
    }

    this.html.classList.add("is-modal");

    // --- Apply content-specific data ---
    const { modalUrl, modalColor, modalOverlay, modalOpacity, modalYoutube } = content.dataset;

    if (modalUrl) {
      content.style.background = `url(${modalUrl}) center center / 100% 100%`;
    } else if (modalColor) {
      content.style.background = modalColor;
    }

    if (modalYoutube) {
      const movieContainer = content.querySelector(".movie");
      if (movieContainer) {
        movieContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${modalYoutube}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }
    }

    if (modalOverlay) {
      overlay.style.background = modalOverlay;
    }
    if (modalOpacity) {
      overlay.style.opacity = modalOpacity;
    }

    content.classList.add("g-modal-content--open", "show");
    modal.style.display = "flex";
    modalWrap.scrollTop = 0;

    // Use .once() equivalent by creating a one-time event listener
    const closeHandler = () => this.close();
    overlay.addEventListener("click", closeHandler, { once: true });
    closeButton.addEventListener("click", closeHandler, { once: true });
  }

  close() {
    if (!this.currentModal) return;

    const modal = this.currentModal;
    const overlay = modal.querySelector(".g-modal-overlay");
    const openContent = modal.querySelector(".g-modal-content--open");

    if (openContent) {
      // Stop YouTube video
      const movieContainer = openContent.querySelector(".movie");
      if (movieContainer) {
        movieContainer.innerHTML = "";
      }

      // Reset styles and classes
      openContent.style.background = "";
      openContent.classList.remove("g-modal-content--open", "show", "not-centering");
    }

    modal.style.display = "";
    this.html.classList.remove("is-modal");

    // Reset overlay styles
    overlay.style.background = "";
    overlay.style.opacity = "";

    this.currentModal = null;
  }
}

export default Modal;
