(function() {
	//#region src/__utility/js/modal.ts
	var Modal = class {
		constructor() {
			this.html = document.querySelector("html");
			this.body = document.querySelector("body");
			this.currentModal = null;
		}
		init() {
			this.body.addEventListener("click", (event) => {
				if (event.target.closest(".g-modal--btn")) this.open(event);
			});
		}
		open(event) {
			const trigger = event.target.closest(".g-modal--btn");
			if (!trigger) return;
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
			if (!content || !overlay || !closeButton || !modalWrap) {
				console.error(`Required modal elements not found in modal "${modalId}".`);
				return;
			}
			this.html.classList.add("is-modal");
			const { modalUrl, modalColor, modalOverlay, modalOpacity, modalYoutube } = content.dataset;
			if (modalUrl) content.style.background = `url(${modalUrl}) center center / 100% 100%`;
			else if (modalColor) content.style.background = modalColor;
			if (modalYoutube) {
				const movieContainer = content.querySelector(".movie");
				if (movieContainer) movieContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${modalYoutube}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
			}
			if (modalOverlay) overlay.style.background = modalOverlay;
			if (modalOpacity) overlay.style.opacity = modalOpacity;
			content.classList.add("g-modal-content--open", "show");
			modal.style.display = "flex";
			modalWrap.scrollTop = 0;
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
				const movieContainer = openContent.querySelector(".movie");
				if (movieContainer) movieContainer.innerHTML = "";
				openContent.style.background = "";
				openContent.classList.remove("g-modal-content--open", "show", "not-centering");
			}
			modal.style.display = "";
			this.html.classList.remove("is-modal");
			if (overlay) {
				overlay.style.background = "";
				overlay.style.opacity = "";
			}
			this.currentModal = null;
		}
	};
	//#endregion
	//#region src/__utility/js/scroller.ts
	var Scroller = class {
		static animationStart(container) {
			const containerEl = typeof container === "string" ? document.querySelector(container) : container;
			if (!containerEl) return;
			containerEl.querySelectorAll(".wait").forEach((element) => {
				const delay = parseInt(element.dataset.delay || "0", 10);
				setTimeout(() => {
					element.classList.remove("wait");
					element.classList.add("animation");
				}, delay);
			});
		}
		static resetAnimate(container) {
			const containerEl = typeof container === "string" ? document.querySelector(container) : container;
			if (!containerEl) return;
			containerEl.querySelectorAll(".animation").forEach((el) => {
				el.classList.add("wait");
				el.classList.remove("animation");
			});
			containerEl.querySelectorAll(".animated").forEach((el) => {
				el.classList.add("waiting");
				el.classList.remove("animated");
			});
		}
		constructor(options = {}) {
			this.observer = null;
			this._handleIntersection = (entries) => {
				for (const entry of entries) {
					const target = entry.target;
					if (entry.isIntersecting && target.classList.contains("waiting")) {
						const delay = parseInt(target.dataset.delay || "0", 10);
						setTimeout(() => {
							target.classList.add("animated");
							target.classList.remove("waiting");
						}, Math.max(0, delay));
						this.observer?.unobserve(target);
					}
				}
			};
			this.options = { rootMargin: options.rootMargin ?? "0px 0px -20% 0px" };
		}
		start() {
			this.stop();
			this.observer = new IntersectionObserver(this._handleIntersection, {
				root: null,
				rootMargin: this.options.rootMargin,
				threshold: 0
			});
			document.querySelectorAll(".waiting").forEach((target) => {
				this.observer.observe(target);
			});
		}
		stop() {
			this.observer?.disconnect();
			this.observer = null;
		}
	};
	//#endregion
	//#region src/assets/js/script.ts
	new Modal().init();
	new Scroller().start();
	//#endregion
})();

//# sourceMappingURL=script.js.map