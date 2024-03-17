# nodejs-jwt-cookie

## 環境構築

1. .env.template をコピーして、適当に書き換える
   `cp .env.template .env`
2. docker を起動
   `docker-compose up -d`
3. backend コンテナ内に入る
   `docker-compose exec db /bin/bash`
4. /app に移動
   `cd /app`
5. .env.template をコピーして、適当に書き換える
   `cp .env.template .env`
6. ライブラリインストール
   `npm install`
7. マイグレーション実行
   `npx prisma migrate dev --name init`

## Express 動作確認

backend のコンテナ内で下記を実行し、ローカルのブラウザから`http://localhost:8000/`にアクセス
`npx ts-node /app/src/index.ts`
