### 회원 가입 sms 인증 서비스

### 구현 기능
- 로그인 기능 (id | name | email | phoneNumber + password)
- 회원가입 기능 (sms 인증이 되었을 경우)
- sms 번호 인증 기능
- 사용자 정보 기능 (로그인 시)
- 비밀번호 변경 기능 (sms 인증이 되었을 경우)

### 주 사용 기술
- Node js, express, sequelize, redis, mysql 5.7
- SMS api
    - Simple & Easy Notification Service

### 실행 방법
- 취상위 location에 .env 파일 생성
- 하기 기입된 코드 추가 및 입력
- Simple & Easy Notification Service 관련 코드 입력 (SENS_*)
    DATABASE_HOST=localhost
    DATABASE_PORT=3306
    DATABASE_USER=
    DATABASE_PASSWORD=
    DATABASE_NAME=
    DATABASE_LOGGING=
    SENS_ACCESS_KEY=
    SENS_SERVICE_ID=
    SENS_SECRET_KEY=
    SENS_FROM_NUMBER=

- redis 서버 설치 필요 -> redis 서버 실행
- yarn install: 의존 패키지 설치.
- yarn start: 백엔드 실행.

