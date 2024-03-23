# starter-nodejs-typescript-prisma-jwt

## 環境構築

1. .env.template をコピーして、適当に書き換える
   `cp .env.template .env`
2. docker を起動
   `docker-compose up -d`
3. backend コンテナ内に入る
   `docker-compose exec backend /bin/bash`
4. .env.template をコピーして、適当に書き換える
   `cp .env.template .env`
5. ライブラリインストール
   `npm install`
6. マイグレーション実行
   `npx prisma migrate dev --name init`
7. express 起動
   `npm start`

## 動作確認

vscode の拡張機能の「REST Client」をインストールし、backend/rest_client/のファイルを実行する

## JWT 認証フロー

### JWT 認証のサインアップとログインのフロー

```mermaid
sequenceDiagram
    participant Client
    participant Server

    Client->>Server: POST api/auth/signup {username, email, role, password}.
    Server->>Server: Check existing. Save User to database.
    Server-->>Client: return Message {"Registered successfully!"}

    Client->>Server: POST api/auth/signin {username, password}
    Server->>Server: Authenticate {username, password}. Create JWT string with a secret
    Server-->>Client: return {token, user info, authorities}

    Client->>Server: Request data with JWT
    Server->>Server: Check JWT Signature. Get user info & authenticate. Authorize using user's Authorities
    Server-->>Client: return Content based on Authorities
```

### トークンの有効期限切れによる再発行のフロー

```mermaid
sequenceDiagram
    participant Client
    participant Server

    Client->>Server: POST api/auth/signin {username, password}
    Server->>Server: Authenticate {username, password}. Create JWT string with a secret
    Server-->>Client: return {token, refreshToken, user info, authorities}

    Client->>Server: request data with JWT
    Server->>Server: Validate JWT throw TokenExpiredError
    Server-->>Client: return Token Expired Message

    Client->>Server: Send Refresh Token request POST api/auth/refreshtoken
    Server->>Server: Verify Refresh Token
    Server-->>Client: return {new token, refreshToken}
```
