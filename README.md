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
   - 아이디가 3글자 이상, 숫자, 영문자 소/대문자로만 구성해야 한다.
   - 비밀번호가 4글자 이상, 숫자,영문자 소/대문자로만 구성해야 한다.
   - 비밀번호에 아이디가 포함되면 회원가입이 불가능합니다.
   - 닉네임을 이미 사용 중이면 회원가입이 불가능합니다.

- 유저 프로필 
   - 유저 프로필 조회하기, 수정하기
   - 유저 프로필 삭제하기

- 게시글 작성하기 CRUD
   - 자신의 생각을 담아 게시글을 작성가능합니다.
   - 다른 유저의 게시글을 조회할 수 있습니다.
   - 권한인증을 통하여, 자신의 게시글을 수정가능하며, 다른 유저의 리뷰글은 수정이 불가능합니다.
   - 권한인증을 통하여, 자신의 게시글을 삭제가능하며, 다른 유저의 리뷰글은 삭제가 불가능합니다.

- 게시글의 댓글 작성하기 CRUD
   - 자신의 생각을 담아 댓글을 작성가능합니다.
   - 다른 유저의 댓글을 조회할 수 있습니다.
   - 권한인증을 통하여, 자신의 댓글을 수정가능하며, 다른 유저의 리뷰글은 수정이 불가능합니다.
   - 권한인증을 통하여, 자신의 댓글을 삭제가능하며, 다른 유저의 리뷰글은 삭제가 불가능합니다.
   
## 6. 해결한 문제/ 앞으로 해결할 문제
`backend`
 - 개인 프로필 정보를 삭제할 때, 전체 User전체 db를 지우지 않고,  특정 db값만 지우고 싶으면 어떡해야 할까?
    - User.deleteOne() 을 사용하면 User 정보 안에 있는 _id, userId, password, userPic, userIntro가 전부 지워진다.
    - 그래서 userPic과 userIntro를 지우기 위해서, findOneAndUpdate( )를 쓰고, userPic 과 userIntro에 null값을 부여했다.
        
        ```jsx
        await User.findOneAndUpdate(
                    { userId: user.userId },
                    { $set: { userIntro : null, userPic : null }}
        )
        ```
        
- 개인 프로필 정보를 조회하기 위해서, back에서 front로 user 정보를 전부 보내는데, 이것이 보안상 위험한데 어떡해 해결 하실 건가요?
    - 비밀번호를 bcrypt를 이용해서 암호화를 한 후, 넘겨줘야 한다.
    - 저희 팀은 bcrypt를 이용하지 않았는데, 앞으로 보안을 탄탄하게 하려면 이용을 해야겠다.
- BackEnd에서 작업을 하다가 정해진 API 설계 그대로 못 하고, 중간에 url을 바꾸게 되는 경우가 생기는데 그때마다 서로 맞추는 것보다 더 효율적인 방법이 있을까요?
    - swagger를 쓰면 된다! → 저희 팀은 안 쓰긴 했는데, 다른 팀이 쓴 것을 보니 front, back에 둘 다 좋은 것 같다.
