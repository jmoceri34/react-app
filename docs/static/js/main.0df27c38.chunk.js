(this["webpackJsonpvideo-loop-tool"]=this["webpackJsonpvideo-loop-tool"]||[]).push([[0],{45:function(e,t,i){},46:function(e,t,i){},55:function(e,t,i){"use strict";i.r(t);var n=i(0),o=i.n(n),d=i(8),a=i.n(d),c=(i(45),i(46),i(11)),r=i.n(c),l=i(87),s=i(88),h=i(6);function u(){var e=void 0,t=void 0,i=void 0,n=void 0,o=void 0,d=new URLSearchParams(window.location.search).get("v");function a(){if(e){e.loadVideoById(d);setTimeout((function(){a(0,e.getDuration()),e.seekTo(n,!0)}),500)}else window.YT?c(d):(window.onYouTubePlayerAPIReady=function(){c(d)},r.a.getScript("https://www.youtube.com/player_api"));function a(d,a){var c=r()("#slider-range").slider({range:!0,min:d,max:a,values:[d,a],slide:function(d,a){n=a.values[0],o=a.values[1],t&&(t[0].innerHTML=l(n,!0,!0)),i&&(i[0].innerHTML=l(o,!0)),(e.getCurrentTime()<n||e.getCurrentTime()>o)&&e.seekTo(n,!0)}});function l(e,t,i){return(t=void 0!=t)&&(e=new Date(1e3*e).toISOString().substr(11,8)),'<span style="position: absolute !important; bottom: -50px; left: '+(i?"-35px":"35px")+'; color: #000 !important;">'+e+"</span>"}r()(c[0].children[1]).empty(),r()(c[0].children[2]).empty(),t=r()(c[0].children[1]).prepend(l(d,!0,!0)),i=r()(c[0].children[2]).prepend(l(a,!0)),n=d,o=a}function c(t){e=new window.YT.Player("player",{playerVars:{modestbranding:1,rel:0,showinfo:0,autoplay:0,mute:0},height:360,width:640,videoId:t,events:{onReady:function(t){a(0,e.getDuration()),e.seekTo(n,!0)},onStateChange:function(t){if(t.data==window.YT.PlayerState.PLAYING){e&&e.getCurrentTime()<n&&e.seekTo(n,!0);var i=setInterval((function(){e.getCurrentTime()>=o&&e.seekTo(n,!0)}),1e3)}else t.data==window.YT.PlayerState.PAUSED?i&&clearTimeout(i):t.data==window.YT.PlayerState.ENDED&&(i&&clearTimeout(i),e.seekTo(n,!0))}}})}}return d&&a(),Object(h.jsxs)("div",{style:{textAlign:"left",width:"640px",margin:"0 auto"},children:[Object(h.jsx)("h1",{children:"Video Loop Tool"}),Object(h.jsx)("div",{style:{display:"block"},children:Object(h.jsx)("div",{id:"player"})}),Object(h.jsx)("div",{style:{display:"block"}}),Object(h.jsx)("div",{style:{display:"block"},children:Object(h.jsx)("div",{id:"slider-range",style:{width:"640px",margin:"12px auto"}})}),Object(h.jsx)("div",{style:{display:"block",textAlign:"left",paddingTop:"25px"},children:Object(h.jsxs)("div",{children:[Object(h.jsx)("h2",{children:"Instructions"}),Object(h.jsx)(l.a,{id:"standard-basic",label:"YouTube VideoID",defaultValue:d,style:{width:"600px"},onChange:function(e){d=e.target.value}.bind(this)}),Object(h.jsx)(s.a,{variant:"contained",color:"primary",onClick:function(){a()},style:{marginTop:"12px"},children:"Setup"}),Object(h.jsx)("h3",{children:"Method 1"}),Object(h.jsx)("p",{children:"Say you have a youtube url like this (where videoId is the youtube video id)"}),Object(h.jsx)("p",{children:Object(h.jsx)("strong",{children:"https://www.youtube.com/watch?v=videoId"})}),Object(h.jsx)("p",{children:"If you change it to this"}),Object(h.jsx)("p",{children:Object(h.jsx)("strong",{children:"https://joemoceri.github.io/video-loop-tool?v=videoId"})}),Object(h.jsx)("p",{children:"By replacing"}),Object(h.jsxs)("p",{children:[Object(h.jsx)("strong",{children:"https://www.youtube.com/watch"})," with ",Object(h.jsx)("strong",{children:"https://joemoceri.github.io/video-loop-tool"})]}),Object(h.jsx)("p",{children:"you can add additional looping capabilities to any youtube video."}),Object(h.jsx)("h3",{children:"Method 2"}),Object(h.jsx)("p",{children:"You can also grab the video id and put it into the field above. Run setup first when changing the video id, then hit play on the youtube video. You can change the range on the slider below to loop a specific part of the video. Then hit play."})]})})]})}i(48);var p=function(){return Object(h.jsx)(u,{})},j=function(e){e&&e instanceof Function&&i.e(3).then(i.bind(null,90)).then((function(t){var i=t.getCLS,n=t.getFID,o=t.getFCP,d=t.getLCP,a=t.getTTFB;i(e),n(e),o(e),d(e),a(e)}))};a.a.render(Object(h.jsx)(o.a.StrictMode,{children:Object(h.jsx)(p,{})}),document.getElementById("root")),j()}},[[55,1,2]]]);
//# sourceMappingURL=main.0df27c38.chunk.js.map