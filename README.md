## Pico React

#### 開発時

1. 開発用サーバーを立ち上げる

```sh
$ yarn dev
```

2. エディタを立ち上げる

```sh
$ code .
```

3. 良い感じにコードをいじる

4. たのしい！


#### デプロイ

1. productionビルドをかます

```sh
$ yarn build
```

2. エラーが発生しておらず、必要なファイルが生成されていることを確かめる

```sh
$ ls public/view/
index.html  main.bundle.js
```

3. 生成されたファイルをサーバーにデプロイする

なおローカルでプロダクションビルドの成果物を動作確認したい場合はダミーのNode serverを用意してあるのでそれを使う

```sh
$ yarn build
$ node www.js
$ open http://localhost:32001
```