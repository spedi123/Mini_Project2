//실행 전에 터미널에 npm install youtube-node 를 실행해야 합니다
//해당 npm 정보는 여기 링크에 있습니다. https://www.npmjs.com/package/youtube-node

var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
// const { getYoutube } = require("./youtube_controller");
var Youtube = require('youtube-node');
var youtube = new Youtube();

var word = '강아지'; // 검색어 지정
var limit = 4;  // 출력 갯수

youtube.setKey('AIzaSyAwIWagsAC_gEHWMQwZxz473rOhk4KXI88'); // API 키 입력

//// 검색 옵션 시작
youtube.addParam('order', 'rating'); // 평점 순으로 정렬
youtube.addParam('type', 'video');   // 타입 지정
youtube.addParam('videoLicense', 'creativeCommon'); // 크리에이티브 커먼즈 아이템만 불러옴
//// 검색 옵션 끝

youtube.search(word, limit, function (err, result) { // 검색 실행
    if (err) { console.log(err); return; } // 에러일 경우 에러공지하고 빠져나감

    console.log(JSON.stringify(result, null, 2)); // 받아온 전체 리스트 출력

    var items = result["items"]; // 결과 중 items 항목만 가져옴
    for (var i in items) { 
        var it = items[i];
        var title = it["snippet"]["title"];
        var video_id = it["id"]["videoId"];
        var url = "https://www.youtube.com/watch?v=" + video_id;
        // var thumbnails = it["thumbnails"]["default"]["url"];
        console.log("제목 : " + title);
        console.log("URL : " + url);
        console.log("-----------");
        // console.log("썸네일: " + thumbnails);
    }
});