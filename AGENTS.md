# AGENTS.md

GitHub プロフィール用リポジトリ。`README.md` のブログ記事一覧は
`scripts/update-blog-posts.js` で更新する。

## ローカルでの実行方法

GitHub Actions の使用量を抑えるため、CI は手動実行（`workflow_dispatch`）のみ。
テスト・更新はローカルで行う。

- `make check`（または `make test`）: README のマーカーとスクリプト構文を簡易チェック
- `make update-blog-posts`: [ham0806/blog](https://github.com/ham0806/blog) を
  `.blog-source/` にクローン（既存なら pull）し、最新記事一覧を `README.md` に反映。
  自分の GitHub 認証で blog リポジトリを clone できることが前提

## pre-push フック（任意）

push 前に `make check` を自動実行したい場合:

```sh
git config core.hooksPath .githooks
```

## CI

`.github/workflows/update-blog-posts.yml` は手動実行のみ。
GitHub の Actions タブから "Update latest blog posts" を実行すると、
同じスクリプトが走り差分があればコミットされる。
