# ARTUBE
문화유튜브만 업로드해 공유하는 공간

## 1. 제작 기간 & 팀원 소개

- 2021/10/11 ~ 2021/10/16
- 6인 1조 팀 프로젝트
   - Backend (Node.js)
    박선웅, 안성규, 황유정
    
   - Frontend (React)
    김다원, 김덕현, 김효진

## 2. 사용 기술

- `Backend`
   - Node.js
   - Express
- `DB`
   - MongoDB


## 3. 노션 설계 페이지 & WireFrame
https://www.notion.so/dawon-ella-kim/1-Artube-bee37ad5fbbe4663a24056ea7f85580a


## 4. 실행화면
[![Video Label](http://img.youtube.com/vi/dmZZtIEX5YM/0.jpg)](https://youtu.be/dmZZtIEX5YM)
- https://youtu.be/dmZZtIEX5YM



## 5. 핵심기능

- 로그인, 회원가입
   - JWT를 이용하여 로그인과 회원가입을 구현하였습니다.
   - 아이디와 닉네임의 중복확인이 가능합니다.

- 자동차 충전소 지역별 검색
   - 크롤링을 통해 서울지역 내 모든 충전소들을 DB에 미리 저장하였습니다.
   - 사용자는 자동차 충전소를 지역 검색을 통해 찾을 수 있습니다.
   - 간편한 페이징기능 탑제, 6개의 항목 이상의 데이터는 페이징 기능을 통하여 다음 페이지로 이동할 수 있습니다.

- 1개의 자동차 충전소에 관한 리뷰글 CRUD
   - 자신의 생각을 담아 리뷰글을 작성가능합니다.
   - 다른 유저의 리뷰글을 조회할 수 있습니다.
   - 권한인증을 통하여, 자신의 리뷰글을 수정가능하며, 다른 유저의 리뷰글은 수정이 불가능합니다.
   - 권한인증을 통하여, 자신의 리뷰글을 삭제가능하며, 다른 유저의 리뷰글은 삭제가 불가능합니다.
   
## 6. 해결한 문제 정리해보기
- `frontend`
   - `login.html`
      - 문제, 회원가입 시 id 중복확인을 통과 후, 중복된 id 입력 후 회원가입이 되는 문제
         - 해결, onChange 이벤트를 이용하여 onChange 시 class를 'is-danger'로 자동변경과 안내 문구 출력
   - `chargeList.html`
      - 문제 1, 이미지가 없을 경우 견본이미지 9장 중 1장을 보이게 해야하는 문제
         - 해결, janja의 if문을 통하여 img tag를 교체하고, src 속성도 jinja를 이용하여 동적으로 연결
      - 문제 2, 견본이미지 9개 종류중 한 개만 나오는 문제
         - 해결, for문을 통해 idx 변수를 만들고 이 idx로 `default_charge{idx}` 처럼 여러 종류의 견본이미지를 불러오도록 해결
      - 문제 3, jinja 템플릿은 파이썬 방식의 for문이며, iterator의 사용이 불가능하며, 최신버전의 jinja는 idx = idx + 1 사용이 불가능하다.
         - 해결, idx를 list로 선언하고, loop마다 append(1)후, idx의 `{{idx|length}}`를 통해 idx를 가져옴
         - 참고, https://stackoverflow.com/questions/1465249/get-lengths-of-a-list-in-a-jinja2-template
      - 문제 4, 리스트의 사진 클릭시 `charge_detail.html`로 `routing` 기능을 넣으며, 그 항목의 `chargeId`를 주어야 하는 문제
         - 해결 1, for문을 통하여 각 충전소 element에 id 값을 jinja로 설정 후 method의 파라미터에 `this.id`로 id를 보내주어 해결
            -참고, https://stackoverflow.com/questions/23655009/how-to-set-the-id-attribute-of-a-html-element-dynamically-with-angularjs-1-x
         - 해결 2, 간단히 method의 파라미터에 jinja를 통하여 id값을 보내주어 해결
   - `charge_detail.html`
      - 문제 1, 리뷰 수정 시 modal 창을 통해 입력, modal 창을 열때 그 리뷰글의 `리뷰id` 값을 저장하여 `backend`로 보내야하는 문제
         - 해결 1,  js를 통하여 modal 클릭시 변수에 id 값을 저장하도록 설정, 모든 리뷰 글은 modal을 클릭 해야하는 전제조건이 있으므로 가능하다.
- `backend`
   - 문제 1, mongodb의 id 값은 `ObjectId('12312123')` 형식이며 이를 전처리하여 `frontend`로 보내야 하는 문제
      - 해결, str() 함수를 통하여 해결, 데이터가 배열인 경우에는 새로운 파이썬 리스트를 선언하고 데이터를 저장하여 보내도록 해결
      - 참고, https://stackoverflow.com/questions/11280382/object-is-not-json-serializable
   - 문제 2, mongodb의 insert, find, delete, update 등 db 조작 중 Exception 처리
      - 해결, `Exception e` 문구를 통해 해결
      - 참고, https://stackoverflow.com/questions/60066390/pymongo-insert-one-exception-error-handling
   - 문제 3, review 글의 수정 삭제 시 내 review글만 삭제, 수정하도록 제한해야하는 문제
      - 해결, 수정, 삭제 실행 전 `권한 체크` 함수를 만들고 review 작성자의 id와 토큰을 통한 로그인 id를 비교하여 권한을 체크할 수 있도록 수정
   - 문제 4, 지역 검색시 find가 아닌 like query문을 사용해야하는 문제
      - 해결, 구글링을 통하여 like 함수 작성
      - 참고, https://stackoverflow.com/questions/10018730/how-use-sql-like-in-pymongo
   - 문제 5, 충전소 리스트를 db에서 불러올 때 페이징네이션으로 잘라서 가져와야하는 문제
      - 해결, 구글링을 통하여 함수 작성
      - 참고, https://journeytosth.tistory.com/31
