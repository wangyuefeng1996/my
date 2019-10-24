<template>
  <div class="player" v-show="$store.getters.getplaying.length>0">
    <!-- 全屏播放器 -->
    <transition name="normal">
      <div class="normal-player" v-show="$store.getters.getfullScreen">
        <div class="background">
          <div class="filter"></div>
          <img :src="$store.getters.getplayList[$store.getters.getcurrentIndex].spic" width="100%" height="100%"/>
        </div>
        <div class="top">
          <div class="back">
            <!--返回按钮-->
            <i class="iconfont icon-xiangzuo" @click="toDown"></i>
          </div>
          <!--歌名和歌手-->
          <div class="song-info">
            <div class="title"><span>{{$store.getters.getplayList[$store.getters.getcurrentIndex].songName}}</span></div>
            <div class="singer"><span>{{$store.getters.getplayList[$store.getters.getcurrentIndex].gname}}</span><i class="iconfont icon-xiangyou"></i></div>
          </div>
          <!--分享-->
          <div class="share">
            <i class="iconfont icon-fenxiang-1" @click="shareShow=!shareShow"></i>
          </div>
        </div>
        <div class="middle" @click="changeMiddle">
          <transition name="middleL"> 
            <div class="middle-pic" v-show="currentShow === 'cd'">
              <div class="cd-wrapper">
                <div class="cd" :class="cdCls">
                  <img :src="$store.getters.getplayList[$store.getters.getcurrentIndex].spic" class="image"/>
                </div>
              </div>
            </div>
          </transition>
          <!--歌词部分-->
          <transition name="middleR">
            <scroll class="middle-lrc" ref="lyricList" v-show="currentShow === 'lyric'" :data="currentLyric && currentLyric.lines">
              <div class="lyric-wrapper">
                <div class="currentLyric" v-if="currentLyric">
                  <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}"
                    v-for="(line, index) in currentLyric.lines" :key="index">
                    {{line.txt}}
                  </p>
                </div>
              </div>
            </scroll>
          </transition>
        </div>
        <div class="bottom">
          <div class="btop">
            <!--收藏这里要变换样式-->
            <div @click="toggleFavoriteList(currentSong)">
              <i v-if="getFavoriteListCollect(currentSong)" style="font-size:20px;color:#ddd;" class="iconfont icon-shoucang1"></i>
              <i v-else style="font-size:20px;color:#f00;" class="iconfont icon-shoucang"></i>
            </div>
            <div><i style="font-size:20px;color:#ddd;" class="iconfont icon-xiazai"></i></div>
            <div><i style="font-size:20px;color:#ddd;" class="iconfont icon-yinxiao"></i></div>
            <div><i style="font-size:20px;color:#ddd;" class="iconfont icon-pinglun"></i></div>
            <div><i style="font-size:20px;color:#ddd;" class="iconfont icon-xiangxixinxi" @click="songInfoShow=!songInfoShow"></i>
            </div>
          </div>
          <div class="bmiddle">
            <!--进度条-->
            <span class="ltime">00:00</span>
            <!-- 进度条组件 -->
            <progressBar style="overflow:hidden" :percent="percent" @percentChange="percentChange"></progressBar>
            <span class="rtime">00:00</span>
          </div>
          <div class="bbottom">
            <div @click="changeMode">
              <i v-if="mode===2" style="color:#fff;font-size:20px;" class="iconfont icon-suijibofang1"></i>
              <i v-if="mode===0" style="color:#fff;font-size:20px;" class="iconfont icon-liebiaoxunhuan"></i>
              <i v-if="mode===1" style="color:#fff;font-size:20px;" class="iconfont icon-danquxunhuan"></i>
            </div>
            <div @click="prev"><i style="color:#fff;font-size:20px;" class="iconfont icon-shangyishoushangyige"></i></div>
            <div @click="togglePlaying">
              <i v-if="playing" id="playButton" style="color:#fff;font-size:40px;" class="iconfont icon-zanting"></i>
              <i v-if="!playing" id="playButton" style="color:#fff;font-size:40px;" class="iconfont icon-bofang"></i>
            </div>
            <div @click="next"><i style="color:#fff;font-size:20px;" class="iconfont icon-xiayigexiayishou"></i></div>
            <div><i style="color:#fff;font-size:20px;" class="iconfont icon-bofangliebiao" @click="playListShow=!playListShow;"></i></div>
          </div>
        </div>
        <!-- 音乐播放器 -->
        <audio ref="audio" @canplay="audioReady" @error="audioError" @timeupdate="timeUpdate" @ended="songEnd"></audio>
      </div>
    </transition>
    <!-- 迷你播放器 -->
    <div class="mini-player" v-show="!fullScreen" @click="toUp">
      <div class="mini-player-con">
        <img :class="playing? 'playSrart' : 'playStorp'" :src="currentSong.image" alt="">
        <p>
          <span class="mini-title" v-html="currentSong.name"></span>
          <span class="mini-name" v-html="currentSong.singer"></span>
        </p>
        <div class="playButton-box">
          <span @click.stop="togglePlaying" class="playButton">
            <img v-if="playing" src="./playStrop.png" alt="">
            <img v-if="!playing" src="./playButton.png" alt="">
          </span>
          <span class="playList" @click.stop="playListClick">
            <img src="./playList.png" alt="播放按钮" title="播放">
          </span>
        </div>
      </div>
    </div>
    <van-action-sheet v-model="shareShow" title="分享">
      <p>分享方式</p>
    </van-action-sheet>
    <van-action-sheet v-model="songInfoShow" title="歌曲信息">
      <p>这里是歌曲的信息</p>
    </van-action-sheet>
    <van-action-sheet v-model="playListShow">
      <p>这里是播放列表</p>
    </van-action-sheet>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shareShow:false,
      songInfoShow:false,
      playListShow:false,
      currentShow:"cd",
    }
  },
  mounted() {
    
  },
  created() {
    
  },
}
</script>


<style scoped>
.normal-player{
  background-image: linear-gradient(to bottom,#000 0%,#333 100%);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
}

.background{
  position: absolute;
  left: -100%;
  top: -120%;
  width: 300%;
  height: 300%;
  z-index: -1;
  opacity: 0.6;
  filter:blur(25px);
}

.top{
  display:flex;
  justify-content:space-around;
  align-items:center;
  width:100%;
  height:8%;
  padding:0.5rem 0;
}

.back{
  width:12.5%;
  text-align:center;
}

.song-info{
  display:flex;
  flex-direction:column;
  justify-content:space-around;
  align-items:center;
  width:75%;
}

.title{
  color:white;
  font-size:18px;
}

.singer{
  color:#aaa;
  font-size:14px;
}


.share{
  width:12.5%;
  text-align:center;
}

.icon-xiangzuo:before {
  content: "\e61d";
  color:white;
  font-size:20px;
}

.icon-fenxiang-1:before {
  content: "\e60b";
  color:white;
  font-size:20px;
}

.icon-xiangyou:before {
  content: "\e683";
  font-size:8px;
}

.middle{
  display: flex;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  font-size: 0;
  height:67%;
}

.middle-pic{
  display:inline-block;
  vertical-align:top;
  position:relative;
  width:100%;
  height:0;
  padding-top:70%;
}

.cd-wrapper{
  position:absolute;
  left:15%;
  width:70%;
  top:0;
  height:100%;
}

.cd{
  width:100%;
  height:100%;
  box-sizing:border-box;
  background-image:linear-gradient(135deg,black 0%,rgba(40,40,40,.6) 40%,rgba(50,50,50,.1) 50%,rgba(40,40,40,.6) 60%,black 100%);
  border-radius:50%;
}

.cd.play{
  animation:rotate 20s linear infinite;
}

.cd.pause{
  animation-play-state:paused;
}

.cd .image{
  position:absolute;
  left:15%;
  top:15%;
  width:70%;
  height:70%;
  border-radius:50%;
}

.middle-lrc{
  display: inline-block;
  position: absolute;
  top: 0;
  vertical-align: top;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.lyric-wrapper{
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
}

.lyric-wrapper .text{
  line-height: 40px;
  color: #c7c7c7;
  font-size: 14px;
}

.lyric-wrapper .text.current{
  color: #fff;
}


@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

.bottom{
  width:100%;
  height:25%;
  display:flex;
  flex-direction:column;
}

.btop{
  display:flex;
  justify-content:space-around;
  align-items:center;
  width:100%;
  height:30%;
}

.btop div{
  text-align:center;
  width:20%;
}

.btop div:first-child{
  margin-left:1rem;
}
.btop div:last-child{
  margin-right:1rem;
}


.bmiddle{
  display:flex;
  justify-content:space-around;
  align-items:center;
  width:100%;
  height:20%;
}

.ltime{
  font:12px Arial;
  color: #bbb;
}

.rtime{
  font:12px Arial;
  color: #999999;
}

.bbottom{
  display:flex;
  justify-content:space-around;
  align-items:center;
  width:100%;
  height:50%;
  padding-bottom:1rem;
}

.bbottom div{
  text-align:center;
  width:19%;
}

.bbottom div:nth-child(3){
  width:24%;
}

.bbottom div:first-child{
  margin-left:1rem;
}

.bbottom div:last-child{
  margin-right:1rem;
}

.icon-xiangzuo:before {
  content: "\e61d";
}

.icon-suijibofang:before {
  content: "\e6f1";
}

.icon-xiayigexiayishou:before {
  content: "\e7a5";
}

.icon-shoucang:before {
  content: "\e60a";
}

.icon-shoucang1:before {
  content: "\e66c";
}

.icon-xiangxixinxi:before {
  content: "\e64c";
}

.icon-xiangyou:before {
  content: "\e683";
}

.icon-fenxiang-1:before {
  content: "\e60b";
}

.icon-xiazai:before {
  content: "\e69a";
}

.icon-pinglun:before {
  content: "\e6b9";
}

.icon-shoucangjia:before {
  content: "\e622";
}

.icon-liebiaoxunhuan:before {
  content: "\e63d";
}

.icon-danquxunhuan:before {
  content: "\e63e";
}

.icon-suijibofang1:before {
  content: "\e625";
}

.icon-bofangliebiao:before {
  content: "\e60c";
}

.icon-shanchu:before {
  content: "\e651";
}

.icon-zanting:before {
  content: "\e6bb";
}

.icon-bofang:before {
  content: "\ec8b";
  font-size:30px;
}

.icon-yinxiao:before {
  content: "\e630";
}

.icon-shangyishoushangyige:before {
  content: "\e645";
}

</style>