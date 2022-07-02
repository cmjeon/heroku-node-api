# 실행방법

## 개요

To-Do 리스트와 각종 정보를 제공하는 백엔드 서버

## 설정 및 실행방법

### .env 설정

```text
// .env
TEST=
SECRET_KEY=
EXPIRATION_DATE=
APIID_OPENWEATHER=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PW=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
CORONA_SVC_KEY=
APPKEY=
```

### 패키지 설치

```bash
$ npm install
```

### 테스트 실행

```bash
$ npm test
```

기본적으로 index.spec.js 에 only 설정되어있음

전체 테스트 케이스 실행 시 indx.spec.js 에 only 설정 제거

### 서비스 실행

```bash
# 디버그 모드로 실행
$ npm run debug

# 프로덕션 모드로 실행
$ npm start
```

## 기타

### heroku push 방법

github 은 main 브랜치를 사용하고, heroku 는 master 브랜치를 사용한다.

수정된 소스는 github 의 main 브랜치로 머지 후 heroku 의 master 브랜치로 머지한다.

1. main branch 소스수정
1. main branch push
    ```bash
    $ git push
    ```
1. master checkout
    ```bash
    $ git checkout master 
    ```
1. merge main
    ```bash
    $ git merge --no-ff main
    ```
1. master push
    ```bash
    $ git push heroku master
    ```

### 명령어

```bash
# push to github
$ git push origin main

# push to heroku
$ git push heroku master

# 로그보기
$ heroku logs --tail

# push environment variables to heroku
$ heroku-dotenv push
```

### TODO

- REST docs 적용하기  

## 참고
- https://medium.com/@yoobi55/express-node-js-%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%B4-%EC%84%9C%EB%B2%84%EB%A5%BC-%EB%A7%8C%EB%93%A4%EC%96%B4-heroku%EC%97%90-%EC%98%AC%EB%A6%AC%EB%8A%94-%EB%B0%A9%EB%B2%95-3a5134fc8743
- 