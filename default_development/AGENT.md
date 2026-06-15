# フロントエンド開発ルール

## 技術スタックとコマンド
- **構成**: Pug + SCSS + Gulp + webpack（静的サイト雛形）。作業ディレクトリはこのプロジェクト直下の `libs/`。
- **コマンド**（`libs/` で実行）:
    - `npm run dev`: 開発サーバー起動（browser-sync / ポートは自動割り当て / watch + ライブリロード）
    - `npm run build`: 本番ビルド（`../htdocs` へ出力、CSS/画像を圧縮）
    - `npm run lint`: ESLint（`src/**/*.js`）+ Stylelint（`src/**/*.scss`）
    - `npm run lint:fix`: 自動修正付きで Lint 実行
- **ライブラリ方針**: CDNは使わず npm 導入してバンドルに含める。
    - カルーセルは **Swiper**（`import Swiper from 'swiper'` + 必要モジュールを個別 import）。
- **Lint**: ESLint v9（flat config / `eslint.config.js`）+ Stylelint（`stylelint-config-standard-scss`）。`@eslint/js` は ESLint 本体と同バージョンに固定。

## プロジェクト構成と編集ルール（重要）
- **ソースディレクトリ**: `libs/src/`（**※AIの編集対象は必ずこのディレクトリ内のみとしてください**）
    - `libs/src/**/*.pug`: HTMLテンプレート
    - `libs/src/assets/css/**/*.scss`: BEM設計に基づいたSCSSファイル
    - `libs/src/assets/js/**/*.js`: WebpackでバンドルされるJavaScriptファイル（ESModules形式）
    - `libs/src/__utility/`: 各種共通モジュール（Pug mixin, SCSS variables/mixin, JavaScript utils）
        - **※注意: このディレクトリ内のファイルは `htdocs` に直接書き出されません。**
        - 必ず `libs/src/` 内のページ（`.pug`）や、`libs/src/assets/` 内のファイル（`.scss`, `.js`）から `include` / `import` / `use` して使用してください。
- `htdocs/` は Gulp によるビルド成果物です。直接編集しないでください（編集は必ず `libs/src/` 側で行う）。

## コーディング規約
コード品質では「CSS設計（BEM）」「CSS変数（:root）によるデザイントークン管理」「保守性の高いJavaScript」「セマンティックなPugマークアップ」の4点を重視します。

### Pug（HTML生成）
- ページ作成や構造の変更は `.pug` ファイルで行ってください。
- **セマンティックHTML**: 見た目に惑わされず、`header`, `main`, `footer`, `nav`, `article`, `section`, `button` 等の適切なタグをインデント構文で正しく記述してください。意味を持たない `div` / `span` の濫用や、`button` であるべき要素を `a` / `div` で実装しないこと。
- **コンポーネントの共通化 (mixins)**: 共通レイアウト（`_template/_layout.pug`）や既存の mixin（`__utility/pug/_mixin.pug` 等）は積極的に活用してください。繰り返し登場するUI（カード、ボタン、ナビゲーション等）は、引数を受け取れる `mixin` として定義し、再利用性と可読性を高めてください。同一マークアップのコピペや、引数化できるはずのハードコードは避けること。
- **BEM記法**: クラス名はBEM (Block__Element--Modifier) を厳守してください（Pugのクラス記法 `.` を活用すること）。命名の詳細規約は「CSS (SCSS)」を参照。
- **CLS対策（レイアウトシフト防止）**: すべての画像について、レイアウトシフト（CLS）が起きないよう表示領域を事前に確保してください。
    - 画像寸法を自動付与する mixin（`__utility/pug/_mixin.pug` の `+img` / `+img2`）を使い、素の `img()` 直書きは避けること。`imageSize()` ヘルパが `width` / `height` を自動付与します。
    - mixin を使わない場合は `img` に `width` / `height` 属性を付与、または親要素に固定サイズ・`aspect-ratio` を指定する。
    - 画像以外でも、Webフォント・iframe・動的挿入される要素・遅延読み込み要素が、領域未確保のままレイアウトシフトを引き起こさない設計にすること。
- **画像の命名・配置**: 画像は `assets/img/<PAGE>/` に配置します。
    - 命名規則は `[種類]-[セクション名].[拡張子]`（例: `img-about.png`, `logo-hero.svg`）。
    - `[種類]` の例: `img`（写真・イラスト）, `bg`（背景）, `icon`（アイコン）, `logo`（ロゴ）, `graph`（グラフ）, `deco`（装飾）など。
    - 同一セクション内に同じ種類の画像が複数ある場合は、種類の直後に連番（例: `img1-about.png`, `img2-about.png`）。
    - 画像が `assets/` にまだ無い場合も、上記命名ルールに従った画像URIを入れておいてください。

### CSS (SCSS)
- **BEM記法の厳守**: クラス名は厳格にBEM (Block__Element--Modifier) に従い、命名のバッティングを防ぎ、構造が直感的に理解できるマルチクラス設計にしてください。
    - ❌ 悪い例: `.card .title`, `.active`（ネストが深すぎる、またはグローバルを汚染する）
    - ⭕ 良い例: `.c-card__title`, `.c-card__title--active`（役割が明確）
- **BEM 規約（PRECSS/FLOCSS型）**:
    1. **区切り文字**: Element は `__`（アンダースコア2つ）、Modifier は `--`（ハイフン2つ）。全ファイルで統一。
    2. **命名ケース**: Block・Element・Modifier すべて小文字 kebab-case（例: `p-item-feature__barrier-solution-wrap`）。PascalCase・camelCase は不可。
    3. **プレフィックス体系**:
        - `l-` … レイアウト（`l-header` `l-footer` `l-menu` `l-main` `l-inner`）
        - `p-` … ページ／プロジェクト固有ブロック（`p-top-hero` `p-item-feature`）
        - `c-` … 再利用コンポーネント（`c-tabs` `c-btn--white` `c-modal`）
        - `u-` … ユーティリティ（単一機能の汎用クラス。`u-display-pc` `u-display-sp`）
        - `js-` … JavaScript用フック（スタイルを当てない。`js-tabs` `js-accordion`）
        - `is-` … 状態クラス（`is-active` `is-open`）
    4. **`p-` ブロックの命名**: 下層ページ独自セクション → `p-[ページ名]-[セクション]`（例: `p-top-hero`）。複数ページ共通の mixin 由来 → `p-[共通名]-[セクション]`（例: `p-item-hero`）。
    5. **二重ネスト禁止**: `Block__El1__El2` は不可。孫要素は Element名側をハイフンで連結（例: `__item-media` `__btn-text`）。
    6. **Block無しのModifier単独クラス禁止**: `.btn--white` のように `--` が Block/Element に紐付かないクラスは違反。コンポーネント化する（`.c-btn--white`）。
    7. **BEM外の素のクラス禁止**: `.circle` `.arrow` `.anchor` のような裸のクラスは指摘対象。JSフックなら `js-`、コンポーネントなら `c-`、汎用ユーティリティなら `u-` を付ける。
- **ユーティリティの活用**: 各種ユーティリティを積極的に `use` して利用してください。
    - `@use` の namespace は短縮します。本プロジェクトの慣例は **variables=`v` / module=`m` / easing=`e`**（例: `@use ".../module" as m;` → `@include m.sp`）。
    - SCSS変数（ブレイクポイント `v.$sw` `v.$maxW`、SP基準幅 `v.$sp`）: `libs/src/__utility/css/_variables.scss`
    - レスポンシブ対応 (`@include m.pc`, `@include m.sp`, `@include m.tablet`): `libs/src/__utility/css/_module.scss`
    - ホバーアニメーション (`@include m.hoverable`): `libs/src/__utility/css/_module.scss`
    - イージング（`e.$easeOutQuart` 等）: `libs/src/__utility/css/_easing.scss`
- **デザイントークン（CSS変数 / :root）の活用**: 色、フォントサイズ、余白（Spacing）、アニメーション速度、Zインデックスなどの共通値は、`:root` 内の CSS カスタムプロパティとして定義・管理し、`var(--color-main)` のように呼び出してください。コンポーネント固有のスタイルファイル内でのマジックナンバー（生の値の直書き）は避けること。
    - `:root` の CSS 変数は `libs/src/assets/css/_0_common.scss` で定義しています。新しい共通値はここに追加してください。
    - **カラー・余白・z-index・アニメーション速度などの共通値は、SCSS変数ではなく CSS変数（`var()`）を優先**して使用してください。
    - **SCSS変数（`_variables.scss`）は、コンパイル時に値が必要なものに限定**します（メディアクエリの条件値 `$sw`/`$maxW`、vw 換算の基準幅 `$sp`）。CSS変数はメディアクエリの条件部では使えないため、ブレイクポイントは SCSS 変数で保持します。
- **レスポンシブ（`@include m.sp`）の記述位置**: SP 用の上書きは Element ごとに散らさず、**親 Block の末尾に `@include m.sp { ... }` を 1 つ置き、その中に各 Element の SP 上書きをまとめて記述**してください（PC の既定宣言とレスポンシブ差分を分離し見通しを良くするため）。Block 自身の SP 上書きは集約ブロック内で `& { ... }` を使う。
- **`calc()` は計算結果（数値）を CSS に出力させず、式のまま残す**: SCSS 内の `calc()` は、Sass がコンパイル時に割り算・掛け算を簡約して結果の数値だけを出力しないようにしてください。デザインの意図（元の数値・比率）と画面幅への追従を保つため、`calc()` 式そのものを CSS に残します。そのために、**演算に含まれる数値・変数（最低でも分母のいずれか）を `#{}` で補間**して Sass の簡約を抑止してください。これは下記の SP の vw 換算や `line-height` の比率に限らず、**`%` / `vw` 換算・比率計算・余白・サイズなどすべての `calc()`** に適用します。
    - ❌ `width: calc(160 / 375 * 100vw);`（Sass が `42.6667vw` に簡約して出力してしまう）
    - ⭕ `width: calc(160 / #{v.$sp} * 100vw);`（`calc(160 / 375 * 100vw)` がそのまま CSS に出力される）
    - ❌ `width: calc(792 / 1000 * 100%);`（`79.2%` に簡約される）／ ⭕ `width: calc(792 / #{1000} * 100%);`
- **SP の寸法は vw 換算（Figma SP のアートボード幅 = `v.$sp` 基準）**: SP（`@include m.sp`）でデザイン値を当てるときは px 固定値を直書きせず、`calc(数値 / #{v.$sp} * 100vw)` の vw 換算で書いてください。対象は font-size / width / height だけでなく、**margin / padding / gap などの余白もすべて**（画面幅に比例して縮拡し、デザインの相対関係を保つため）。`v.$sp` は Figma SP デザインのアートボード幅（現状 `375`、デザインに合わせて調整）。PC のレイアウトは原則 px 等の既定値のまま据え置き、vw 換算は SP 上書きだけに適用します。
    - ❌ `width: 160px;` ／ `padding: 30px;`（SP で px 直書き）
    - ⭕ `width: calc(160 / #{v.$sp} * 100vw);` ／ `padding: calc(30 / #{v.$sp} * 100vw);`
- **`line-height` は比率（行間 ÷ 文字サイズ）で指定（PC・SP 共通）**: px 固定ではなく、Figma の「行間 ÷ 文字サイズ」を単位なしの比率で書いてください。Sass が割り算を簡約しないよう、分母（文字サイズ）は `#{}` で囲みます。
    - ❌ `line-height: 35px;` ／ ⭕ `line-height: calc(35 / #{22});`（行間 35 / 文字サイズ 22）
    - `letter-spacing` は Figma の % 値をそのまま em に対応させます（Figma `10` → `0.1em`、`0` → `0`）。

### JavaScript
- Webpackでバンドルされるため、ESModules (`import`/`export`) 形式で記述してください。
    - Webpack 5 の strict ESM 仕様により、モジュール間の `import` には拡張子 `.js` が必須です（例: `import Modal from '../../__utility/js/modal.js';`）。
- DOM操作や機能追加を行う場合は、保守性を考慮しクラス化やモジュール分割を行ってください。共通ロジックは `libs/src/__utility/js/` に切り出し、各ページの `script.js` から `import` してください。
- **単一責任の原則**: 1つの関数やクラスが、1つのことだけを行う設計にすること。
- **純粋関数の推奨**: 副作用を最小限に抑え、テストが容易で再利用できる汎用的なロジックにすること。
- **マジックナンバーの排除**: 重要な定数はオブジェクトや共通定数モジュール（`__utility/js/constants.js` 等）で共通化し、コードの意図がドキュメントなしで伝わるよう疎結合に書くこと。
- イベントリスナーの登録は要素数分の累積に注意し、不要なら `removeEventListener` するか、ページ全体で1つに集約すること（既存の `modal.js` のようにイベント委譲を活用）。
- **共通UI**: モーダル（`_modal.scss` / `modal.js`）とスクロール出現アニメ（`_scroller.scss` / `scroller.js`）は `style.scss` / `script.js` から接続済み。対象要素がなければ無害な no-op。

### アセット（画像やファイルの配置ルール）
- 新しい画像やファイルを追加する場合、タスクはGulpの watch で自動処理されるため、ファイルの配置のみを行ってください。
    - **圧縮対象 (`.jpg`, `.png`, `.gif`, `.svg`, `.webp`)**: `libs/src/` 以下の適切なフォルダに配置。`.webp` は `imagemin-webp` で圧縮されます（jpg/png は webp へ変換せず、各形式のまま圧縮）。
    - **コピー対象 (`.mp4`, `.pdf` など)**: `libs/src/` 以下の適切なフォルダに配置。（圧縮されずそのままコピーされます）
- 画像は `+img` / `+img2` mixin で配置すれば `.webp` でも `width` / `height` が自動付与されます（`image-size` が webp 対応のため）。

### アクセシビリティ（重要）
- **WCAG 2.2 レベル AA** 準拠を目標とします。
- 適切な `aria-label`、`aria-hidden`、および `alt` 属性を必ず提案・実装してください。
- キーボード操作やスクリーンリーダーでの読み上げを考慮した実装を心がけてください。
- `target="_blank"` で別ウィンドウ（別タブ）を開くAタグには `rel="noopener noreferrer"` と `aria-label="（新しいタブで開きます）"` をつけてください。

## セクションごとのファイル分割ルール（重要）
- 1ページ内に複数のセクション（Hero, Aboutなど）が存在する場合、可読性と保守性のために Pug と SCSS をセクション毎に分割して実装してください。
- **Pugの分割**:
    - Gulpの仕様上、直接HTMLとして出力させないために、分割するファイル名は必ず `_` (アンダースコア) から始めてください。（例: `_hero.pug`, `_about.pug`）
    - 作成したパーツは、親となるページ（例: `index.pug`）から `include` して読み込んでください。
    - 配置例: `libs/src/_components/_hero.pug` や、ページ専用フォルダ `libs/src/index/_hero.pug` など。
- **SCSSの分割**:
    - 同様に、ファイル名は必ず `_` (アンダースコア) から始めてください。（例: `_hero.scss`, `_about.scss`）
    - 作成したパーツは、`libs/src/assets/css/style.scss` 等の親ファイルから `@forward` して読み込んでください。
    - 配置例: `libs/src/assets/css/components/_hero.scss` や、ページ専用フォルダ `libs/src/assets/css/index/_hero.scss` など。

## Figma MCP 連携の場合（※連携がない場合は無視）
- Figmaのデザイン要素を実装する際は、デザインの意図（マージン、カラー、タイポグラフィ）を正確に CSS変数・SCSS変数へ変換してください。
- Figmaのデザイン要素を実装する際は、共通するコンポーネントやモジュールを確認して、使い回せるようにしてください。
- 数値が不明な場合は、既存のプロジェクト（`_variables.scss`, `_0_common.scss` など）の傾向に合わせるか、質問してください。
- 特に以下の点に注意して、デザインの「意図」を汲み取って実装してください：
    - **【レイアウトと相対配置】Figma上の固定値（絶対的なpx指定や `position: absolute`）をそのまま鵜呑みにしないでください。** 画面幅の変更に対応できるよう、Flexbox、CSS Grid、相対値（`%`, `vw`, `rem`, `gap`, `margin`, `padding` 等）を駆使して、よしなにレスポンシブな配置を行ってください。（※装飾的なあしらいなど、絶対配置が適している場合のみ `position: absolute` を許可します）
    - **【トークンと変数の利用】**色、タイポグラフィ、共通の余白などはマジックナンバー（固定値の直書き）を避け、既存の CSS変数（`var(--color-***)` 等）や SCSS変数を優先して使ってください。足りない場合は `_0_common.scss` の `:root` に追加してください。
- **ページ構成とディレクトリの対応ルール**:
  Figmaのアートボード名から、作成すべきPugファイルのパスを以下のように判断してください。
    - **トップページ**（`トップページ`, `インデックスページ`, `トップ`, `top` など）の場合:
        - ルートディレクトリに作成してください。（例: `libs/src/index.pug`）
    - **下層ページ（単独カテゴリ）**（`About`, `アバウトページ`, `Company` など）の場合:
        - カテゴリ名のディレクトリを作成し、その中の `index.pug` としてください。（例: `libs/src/about/index.pug`）
    - **下層ページ（同一カテゴリ内に複数ある場合）**（`Product A`, `Product B` など）の場合:
        - カテゴリ名をディレクトリ名とし、個別の名前をファイル名としてください。（例: `libs/src/product/a.pug`, `libs/src/product/b.pug`）
- 画像の命名規則は Pug セクションの「画像の命名・配置」を参照してください。
    - Figma からの画像書き出しは手動で行い、上記の命名規則に従って `assets/img/<PAGE>/` に配置してください。
