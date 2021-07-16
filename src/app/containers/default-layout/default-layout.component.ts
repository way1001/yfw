import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/core/_models';
import { UserInfoService } from '@app/core/_service/userInfo.service';

// declare var wx: any;

@Component({
  selector: 'app-layout',
  templateUrl: 'default-layout.component.html',
  // styleUrls: [
  //   '../../pages/side-menu/styles/side-menu.scss',
  //   '../../pages/side-menu/styles/side-menu.shell.scss',
  //   '../../pages/side-menu/styles/side-menu.responsive.scss'
  // ]
})
export class DefaultLayoutComponent implements OnInit {
  appPages = [
    {
      title: '首页',
      url: '/app/home',
      ionicIcon: 'home-outline'
    },
    {
      title: '发现',
      url: '/app/dl',
      ionicIcon: 'disc-outline'
    },
    {
      title: '周边',
      url: '/app/peripherals',
      ionicIcon: 'map-outline'
      // customIcon: './assets/custom-icons/side-menu/contact-card.svg'
    },
    {
      title: '支持',
      url: '/app/contact-card',
      ionicIcon: 'notifications-outline'
    }
  ];
  accountPages = [
    {
      title: '我的点评',
      url: '/dil/own',
      ionicIcon: 'leaf-outline'
    },
    /* {
        title: '我的关注',
        url: '/auth/login',
        ionicIcon: 'log-in-outline'
    }, */
    /* {
      title: '商户入住',
      url: '/auth/signup',
      ionicIcon: 'person-add-outline'
    }, */
    /* {
      title: 'Tutorial',
      url: '/walkthrough',
      ionicIcon: 'school-outline'
    },
    {
      title: 'Getting Started',
      url: '/getting-started',
      ionicIcon: 'rocket-outline'
    },
    {
      title: '404 page',
      url: '/page-not-found',
      ionicIcon: 'alert-circle-outline'
    } */
  ];

  currentUserInfo;
  isReg: true;

  constructor(private userInfoService: UserInfoService) { }

  ngOnInit(): void {

    this.userInfoService.getUserInfo().subscribe(res => {
      this.currentUserInfo = res.data;
      if (this.currentUserInfo) {
        localStorage.setItem('userRole', this.currentUserInfo?.userRole);
        localStorage.setItem('affiliated', this.currentUserInfo?.affiliated);
      }
    });


    /* this.code = this.activatedRoute.snapshot.queryParams['code'];

    if (!this.code) {
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/' + '' +
      'authorize?appid=wx5fa87befa423b8cc&redirect_uri=' + encodeURIComponent(window.location.href) + '&response_type=code' +
    '&scope=snsapi_userinfo&state=shared#wechat_redirect';
    } */
    // this.authenticationService.currentUser.subscribe(res => {
    //   this.currentUser = res;
    // });
    // this.formsValidationsService.getCategoryTree().subscribe(
    //   res => {
    //     if (res.ok) {
    //       localStorage.setItem('category', JSON.stringify(res.data));
    //     }
    //   }
    // );
    // this.merchantService.getJsapiSignature(window.location.href).subscribe(
    //   sig => {
    //     if (sig.ok) {
    //       wx.config({
    //         debug: false, // true:是调试模式,调试时候弹窗,会打印出日志
    //         appId: sig.data.appId, // 微信appid
    //         timestamp: sig.data.timestamp, // 时间戳
    //         nonceStr: sig.data.nonceStr, // 随机字符串
    //         signature: sig.data.signature, // 签名
    //         jsApiList: [
    //           // 所有要调用的 API 都要加到这个列表中
    //           'onMenuShareTimeline', // 分享到朋友圈接口
    //           'onMenuShareAppMessage', //  分享到朋友接口
    //           'onMenuShareQQ', // 分享到QQ接口
    //           'onMenuShareWeibo', // 分享到微博接口
    //           'updateTimelineShareData',
    //           'updateAppMessageShareData'
    //         ],
    //         openTagList: [
    //           'wx-open-launch-weapp',
    //         ]
    //       });
    //       wx.checkJsApi({
    //         jsApiList: [
    //           // 所有要调用的 API 都要加到这个列表中
    //           'onMenuShareTimeline', // 分享到朋友圈接口
    //           'onMenuShareAppMessage', //  分享到朋友接口
    //           'onMenuShareQQ', // 分享到QQ接口
    //           'onMenuShareWeibo', // 分享到微博接口
    //           'updateTimelineShareData',
    //           'updateAppMessageShareData'
    //         ],
    //         openTagList: [
    //           'wx-open-launch-weapp',
    //         ],
    //         success: function (ress) {
    //           // alert('checkJsApi:success');
    //         }
    //       });
    //       wx.ready(() => {
            
    //         // 微信分享的数据
    //         const shareData = {
    //           imgUrl: 'http://img.aiforest.net/logo.jpg', // 分享显示的缩略图地址
    //           link: window.location.href,
    //           desc: '本地买房、装修、建材一站式全行业资讯平台', // 分享描述
    //           title: '天门家园', // 分享标题
    //           success: function () {
    //             // 分享成功可以做相应的数据处理
    //             // alert('分享成功');
    //             // alert('appId:' + res.appId)
    //             // alert('timestamp:' + res.timestamp)
    //             // alert('nonceStr:' + res.nonceStr)
    //             // alert('signature:' + res.signature)
    //           },
    //           fail: function () {
    //             // alert('调用失败');
    //           },
    //           complete: function () {
    //             // alert('调用结束');
    //           }
    //         };
    //         wx.updateTimelineShareData(shareData);
    //         wx.updateAppMessageShareData(shareData);
    //         // wx.onMenuShareTimeline(shareData);
    //         // wx.onMenuShareAppMessage(shareData);
    //         wx.onMenuShareQQ(shareData);
    //         wx.onMenuShareWeibo(shareData);
    //       });
    //       wx.error(function (ress) {
    //         // config信息验证失败会执行error函数，如签名过期导致验证失败，
    //         // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
    //         // 对于SPA可以在这里更新签名。
    //         // console.log(ress);
    //         // alert('分享失败' + JSON.stringify(ress));
    //       });
    //     }

    //   });
    /*  document.body.addEventListener('touchmove', function (event) {
       event.preventDefault();
   }, false); */
  }

}
