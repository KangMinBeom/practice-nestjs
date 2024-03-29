
먼저 코딩을 시작하면 로그인, 회원가입 기능부터 시작하는 경우가 많습니다. 하지만 실무에서 사용하는 수준의 코드를 작성하게 된다면 로그인, 회원가입도 난이도가 굉장히 높습니다. 
이 프로젝트에서는 실무에서 사용하는 수준의 로그인과 회원가입 그리고 결제 기능을 구현할 것 입니다.

## 설치 방법
```
//패키지 설치
yarn install

//구동
docker-compose up -d
```

## 구현 범위
- auth: 회원가입, 로그인, JWT(AccessToken, RefreshToken)을 사용하여 인증을 담당합니다.
- payment:주문, 결제를 담당합니다. 장바구니, 배송, 포인트/쿠폰 시스템을 담고 있습니다.

## 기술스택
- TypeScript + NestJS + SWC
- Yarn berry + Plug'n'Play + Zero-Install
- TypeORM + PostgreSQL
- Joi
- Jest

## 주요 기능
### 회원가입
이메일, 비밀번호, 비밀번호 확인, 이름, 전화번호를 입력하여 회원가입 절차를 거칩니다.
### 로그인
이메일, 비밀번호를 통해 사용자를 검증합니다.
### 토큰
유효한 토큰인지 검증을 하고 유효하지 않다면, 리프레쉬 토큰이 유효한지 검증하고 유효하다면 새로운 액세스 토큰을 발급합니다. 
### 토큰 블랙리스트
유효 기간이 지난 토큰을 블랙리스트로 관리하고 조회할 수 있습니다. 
### 로그아웃
로그아웃 시 현재 가지고 있는 액세스 토큰과 리프레쉬 토큰을 블랙리스트에 저장합니다.  
### 주문
주문 생성할 때 주문의 필요한 정보들을 입력하고 주문을 완료합니다.
### 장바구니 
상품의 ID 정보를 토대로 장바구니에 상품을 담을 수 있습니다. 
### 포인트 
결제할 때 포인트를 사용한다면 사용한 포인트 만큼 할인이 적용됩니다. 
### 쿠폰
가지고 있는 쿠폰의 기간이 유효하거나 사용하지 않은 쿠폰일 경우, 정액제라면 ￦만큼 할인이 적용되고 정률제라면 %만큼 할인이 적용됩니다. 
### PG 결제
장바구니에 담겨있는 항목들을 PG를 이용하여 결제합니다. 


