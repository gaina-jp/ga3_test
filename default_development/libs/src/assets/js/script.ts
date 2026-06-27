import Modal from '../../__utility/js/modal';
import Scroller from '../../__utility/js/scroller';

// 共通モーダル
// <button class="g-modal--btn" data-modal-id="xxx" data-modal-content="yyy"> で開閉
const modal = new Modal();
modal.init();

// スクロール出現アニメーション
// .waiting を付けた要素がビューポートに入ると .animated 化（_scroller.scss と対応）
const scroller = new Scroller();
scroller.start();
