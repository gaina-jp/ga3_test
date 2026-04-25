export default class Scroller {
  /**
   * 指定されたコンテナ内の ".wait" 要素に対して、一度だけアニメーションを発火させます。
   * @param {HTMLElement|string} container - アニメーションの対象要素が含まれるコンテナのDOM要素、またはセレクタ。
   */
  static animationStart(container) {
    const containerEl = typeof container === 'string' ? document.querySelector(container) : container;
    if (!containerEl) return;

    const waitElements = containerEl.querySelectorAll(".wait");
    waitElements.forEach(element => {
      const delay = parseInt(element.dataset.delay || '0', 10);

      setTimeout(() => {
        element.classList.remove("wait");
        element.classList.add("animation");
      }, delay);
    });
  }
  
  /**
   * アニメーションされた要素を初期状態に戻します。
   * @param {HTMLElement|string} container - リセット対象の要素が含まれるコンテナのDOM要素、またはセレクタ。
   */
  static resetAnimate(container) {
    const containerEl = typeof container === 'string' ? document.querySelector(container) : container;
    if (!containerEl) return;

    const animateElements = containerEl.querySelectorAll(".animation");
    const animatingElements = containerEl.querySelectorAll(".animated");

    animateElements.forEach(element => {
      element.classList.add("wait");
      element.classList.remove("animation");
    });

    animatingElements.forEach(element => {
      element.classList.add("waiting");
      element.classList.remove("animated");
    });
  }
  
  /**
   * @param {Object} [options] - Scrollerのオプション設定
   * @param {string} [options.rootMargin='0px 0px -20% 0px'] - Intersection ObserverのrootMargin
   */
  constructor(options = {}) {
    this.observer = null;
    this.options = {
      rootMargin: options.rootMargin || '0px 0px -20% 0px',
    };
    // Intersection Observer のコールバック関数内で `this` のコンテキストを維持するためにバインド
    this._handleIntersection = this._handleIntersection.bind(this);
  }
  
  /**
   * Intersection Observer のコールバック関数。
   * 要素がビューポートに入ったときにアニメーションを実行します。
   * @param {Array<IntersectionObserverEntry>} entries - 交差状態が変化した要素のリスト。
   * @param {IntersectionObserver} observer - このコールバックが呼び出された IntersectionObserver。
   * @private
   */
  _handleIntersection(entries, observer) {
    for (const entry of entries) {
      const target = entry.target;
      if (entry.isIntersecting && target.classList.contains('waiting')) {
        const delay = parseInt(target.dataset.delay || '0', 10);
        
        setTimeout(() => {
          target.classList.add("animated");
          target.classList.remove("waiting");
        }, Math.max(0, delay));
        
        observer.unobserve(target); // 一度アニメーションしたら監視を停止
      }
    }
  }
  
  /**
   * スクロールアニメーションの監視を開始します。
   * `.waiting` クラスを持つすべての要素を監視対象とします。
   */
  start() {
    if (this.observer) {
      this.stop(); // 既にobserverが存在する場合は一度停止
    }
    
    // Intersection Observer のオプション設定
    // root: null はビューポートをルート要素とすることを意味します。
    // rootMargin: constructorで設定した値（デフォルト: '0px 0px -20% 0px'）
    // threshold: 0 は、ターゲット要素が1ピクセルでも交差したらコールバックが発火することを意味します。
    const observerOptions = {
      root: null,
      rootMargin: this.options.rootMargin,
      threshold: 0
    };
    
    this.observer = new IntersectionObserver(this._handleIntersection, observerOptions);
    
    // 監視対象の要素を取得し、監視を開始
    const targets = document.querySelectorAll(".waiting");
    targets.forEach(target => {
      this.observer.observe(target);
    });
  }
  
  /**
   * スクロールアニメーションの監視を停止します。
   * すべての監視対象要素から監視を解除します。
   */
  stop() {
    if (this.observer) {
      this.observer.disconnect(); // すべての監視を解除
      this.observer = null;
    }
  }
}
