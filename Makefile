BLOG_REPO ?= git@github.com:ham0806/blog.git
BLOG_SOURCE_DIR ?= .blog-source

.PHONY: test check update-blog-posts

test: check ## ローカルチェックのエイリアス

check: ## README マーカーとスクリプトの簡易チェック
	@node --check scripts/update-blog-posts.js
	@grep -q 'BLOG-POST-LIST:START' README.md
	@grep -q 'BLOG-POST-LIST:END' README.md
	@grep -q 'QIITA-POST-LIST:START' README.md
	@grep -q 'QIITA-POST-LIST:END' README.md
	@echo "check OK"

update-blog-posts: ## ブログリポジトリから最新記事一覧を取得して README.md を更新
	@if [ -d "$(BLOG_SOURCE_DIR)/.git" ]; then \
		git -C "$(BLOG_SOURCE_DIR)" pull --ff-only; \
	else \
		git clone "$(BLOG_REPO)" "$(BLOG_SOURCE_DIR)"; \
	fi
	node scripts/update-blog-posts.js "$(BLOG_SOURCE_DIR)/src/content/blog" README.md
