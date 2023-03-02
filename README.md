# 初期導入

Ctrl + Shift + F ディレクトリ内検索
react-template
テンプレート作成時のプロジェクト名。
任意のプロジェクト名に全て置換。

$ npm install
必要なパッケージをインストール。

$ npx kintone-plugin-packer plugin
プラグインの初期生成。
生成された「○○○○○.ppk」ファイルを「private.ppk」にリネーム

# ./src/ について

config/config.tsx
プラグインの設定画面で動作する処理を書くところ

desktop/desktop.ts
プラグインの実際の動作処理を書くところ

mobile/mobile.ts
プラグインのモバイルアプリ動作を書くところ。

処理を書けたら、もしくはテスト動作がしたい。となったら
ターミナルで以下コマンド

$ npm start

プラグインをパッケージ化して、kintone にアップロードしてくれる。
その他、不明点あれば川手まで。
