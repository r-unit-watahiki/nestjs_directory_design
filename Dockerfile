# マルチステージビルドでイメージサイズを最適化
FROM node:20-alpine AS development

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# アプリケーションのソースをコピー
COPY . .

# ビルド
RUN npm run build

# プロダクション用のステージ
FROM node:20-alpine AS production

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# プロダクション依存関係のみをインストール
RUN npm ci --only=production && npm cache clean --force

# ビルドされたアプリケーションをコピー
COPY --from=development /app/dist ./dist

# ポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["node", "dist/main"]
