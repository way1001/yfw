import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { FormsValidationsService } from './forms-validations.service';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { UploadService } from '@app/core/_service/uploader.service';
import { map, catchError } from 'rxjs/operators';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import Compressor from 'compressorjs';
import { Router } from '@angular/router';

// const data = [
//   {
//     url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg'
//   },
//   {
//     url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg'
//   }
// ];


@Component({
  selector: 'forms-validations-page',
  templateUrl: './forms-validations.page.html',
  styleUrls: [
    './styles/forms-validations.page.scss'
  ]
})
export class FormsValidationsPage implements OnInit {

  validationsForm: FormGroup;
  genders: Array<string>;

  ownInfo: any;

  imgChange: false;

  validations = {
    'real_name': [
      { type: 'required', message: '名称不能为空.' },
    ],
    // 'lastname': [
    //   { type: 'required', message: 'Last name is required.' }
    // ],
    // 'email': [
    //   { type: 'required', message: 'Email is required.' },
    //   { type: 'pattern', message: 'Enter a valid email.' }
    // ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
    ],
    /* 'address': [
      { type: 'required', message: 'Number must be between: ' }
    ], */
  };

  // files = data.slice(0);
  multiple = false;

  category: any[];
  generas = [];
  subclasses = [];
  tags = [];

  generaIndex = [];
  subclassIndex = [];

  imgChange1 = false;
  imgChange2 = false;

  currentUser;

  constructor(private formsValidationsService: FormsValidationsService,
    public modalController: ModalController,
    private uploadService: UploadService,
    public router: Router) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.category = JSON.parse(localStorage.getItem('category'));
  }

  async ngOnInit() {

     this.genders = [
      '其它',
      '先生',
      '女士'
    ];

    this.validationsForm = new FormGroup({
      'real_name': new FormControl('', Validators.required),
      'nick_name': new FormControl(''),
      'gender': new FormControl('', Validators.required),
      'phone': new FormControl({ value: '', disabled: true }),
      'province': new FormControl(''),
      'city': new FormControl(''),
      'about': new FormControl(''),
      'headimg_url': new FormControl([]),
    });

    this.formsValidationsService.getOwnInfo().subscribe(res => {
      if (res.ok) {
        this.ownInfo = res.data;

        this.s(this.ownInfo);

        console.log(this.ownInfo);
      }
    })
    
  }

  get f() { return this.validationsForm.controls; }

  s(mb) {
    if (mb.phone) {

      this.f.real_name.setValue(mb.realName);
      this.f.nick_name.setValue(mb.nickName);
      this.f.gender.setValue(this.genders[mb.sex]);
      this.f.about.setValue(mb.about);
      this.f.phone.setValue(mb.phone);
      this.f.province.setValue(mb.province);
      this.f.city.setValue(mb.city);

      mb.headimgUrl ? this.f.headimg_url.setValue([{ url: `${mb.headimgUrl}` }]) : null;
      
    }
  }

  onSubmit() {

    let headimgUrl = this.imgChange === false ? this.ownInfo.headimgUrl : (this.f.headimg_url.value[0] ? (this.f.headimg_url.value[0].link ? this.f.headimg_url.value[0].link : '') : '');


    this.formsValidationsService.updateInfo(this.ownInfo.id, this.f.real_name.value, this.f.nick_name.value,
      this.genders.indexOf(this.f.gender.value) || 0, this.f.phone.value, this.f.province.value, this.f.city.value,
      this.f.about.value, headimgUrl).subscribe(
        res => {
          if (res.ok) {
            this.router.navigate(['/app/home']);
          }
        });
  }

  ImageChange(params) {
    const { files, type, index } = params;
    // this.files = files;
  }

  async fileChange(params) {
    const { files, operationType, index } = params;

    /*  const pu = (fd)=>{ 
       this.files.push({ data: fd, inProgress: false, progress: 0});  
       this.files.forEach(file => {  
         this.uploadFile(file);  
       });
     }; */


    switch (operationType) {
      case 'add':
        if (files) {
          // collect promises from the compression function
          const compressPromises: Promise<File>[] = [];
          for (const file of files) {
            compressPromises.push(this.compressImage(this.dataURItoBlob(file.url)));
          }

          // wait until these properties are resolved and loop through the result
          Promise.all(compressPromises).then((compressedFiles) => {
            for (const file of compressedFiles) {
              const formData = new FormData();

              formData.append('file', file);
              formData.append('dir', '');
              formData.append('fileType', 'image');

              this.uploadFile({ data: formData, inProgress: false, progress: 0});
              // do whatever you need to do with these files - upload to server or whatever
            }
          }).catch((error) => console.log('ooops :(', error));

          /* for (let i = 0; i < files.length; i++) {
            const file = files[i];  
            //console.log("图片大小：" + file.url.length / 1024  + "KB");//打印计算出来的图片大小
            //const prop = Math.sqrt( file.url.length / 102400 / 1.3);
            // 若图片>100kb，即压缩比例>1，压缩图片
            //if (prop > 1) {
            //  this.compressedImg(file.url, prop);//使用canvas压缩图片
            //} else {//否则，可以直接使用该图片
            //  console.log(file.url);
            //}
           new Compressor(this.dataURItoBlob(file.url), {
              quality: 0.6,
              convertSize: 500000,
              success(result) {
                // console.log(result);
                const formData = new FormData();

                formData.append('file', result);
                formData.append('dir', 'merchant');
                formData.append('fileType', 'image');

                pu(formData);

              },
              error(err) {
                console.log(err.message);
              },
            });
            // this.files.push({ data: file, inProgress: false, progress: 0});  
          }
          //TODO 压缩以后异步方式问题
          // this.files.forEach(file => {  
          //   this.uploadFile(file);  
          // }); */
        }
        break;
      case 'remove':

        //TODO not delete 7niu
        break;
      default:
        break;
    }
  }

  /* //使用canvas压缩图片
  compressedImg = function(path, prop){
    var img = new Image();
    img.src = path;
    img.onload = function () {
        var that = this;
        // 按压缩比例进行压缩
        var w = that.width/prop,
            h = that.height/prop;
        // console.log(w);
        // console.log(h);
        var quality = 1;  // 默认图片质量为1
        //生成canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // quality值越小，所绘制出的图像越模糊
        var imgUrl = canvas.toDataURL('image/jpeg', quality);//压缩后的图片base64码
        console.log(imgUrl);//打印压缩后的图片base64码
        console.log("压缩后：" + imgUrl.length / 1024 + "KB");
    }
  }; */

  compressImage(file): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,
        convertSize: 500000,
        success: (result) => {
          resolve(new File([result], file.name ? file.name : '', { type: result.type }))
        },
        error: (error: Error) => reject(error)
      })
    });
  }

  uploadFile(file) {
    // const formData = new FormData(); 
    // console.log(this.dataURItoBlob(file.data.url));
    // formData.append('file', this.dataURItoBlob(file.data.url));  

    // formData.append('dir', 'merchant');
    // formData.append('fileType', 'image');

    file.inProgress = true;
    this.uploadService.upload(file.data).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
              this.f.headimg_url.value[0].link = event.body.link
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.data.name} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          console.log(event.body);
        }
      });
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }
    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  imageClick(params) {
    console.log(params);
  }

  
}
