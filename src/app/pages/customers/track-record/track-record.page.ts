import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadService } from '@app/core/_service/uploader.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import Compressor from 'compressorjs';
import { CustomersService } from '../customers.service';

@Component({
  selector: 'app-track-record',
  templateUrl: 'track-record.page.html',
  styleUrls: [
    './styles/track-record.page.scss'
  ]
})

export class TrackRecordPage implements OnInit{
  private loadingElement: any;
  private singleLoading = false;

  validationsForm: FormGroup;

  intention: [];
  @Input() referralsId;
  @Input() userId;

  multiple = 1;

  handleTypes: Array<string>;

  validations = {
    'take_bill': [
      { type: 'required', message: '不能为空，请上传相关跟办图片详情' }
    ],
    'details': [
      { type: 'required', message: '内容不能为空' }
    ],
    'handle_type': [
      { type: 'required', message: '需选择一项.' }
    ],
  };

  constructor(private modalController: ModalController,
    private uploadService: UploadService,
    private loadingController: LoadingController,
    private customersService: CustomersService) { }

  ngOnInit(): void {
    this.handleTypes = [
      '跟办',
      '来访/带看（需审核）',
      '成交确认（需审核）'
    ];

    this.validationsForm = new FormGroup({
      
      'take_bill': new FormControl([]),
      'details': new FormControl('', Validators.required),
      'handle_type': new FormControl('', Validators.required),
    });
    
  }

  async presentLoader() {
    this.loadingElement = await this.loadingController.create({
      message: '加载中 ...'
    });

    await this.loadingElement.present();
    const { role, data } = await this.loadingElement.onDidDismiss();
    this.singleLoading = false; 
  }

  async dismissLoader() {
    if (this.loadingElement) {
      await this.loadingElement.dismiss();
    }
  }

  get f() { return this.validationsForm.controls; }

  dismiss(): void {
    this.modalController.dismiss();
  }

  // passDismiss() {
  //   // using the injected ModalController this page
  //   // can "dismiss" itself and optionally pass back data
  //   this.modalController.dismiss({
  //       'intention': this.intention
  //   });

  // }

  onSubmit(values) {
    if (!this.referralsId || !this.f.take_bill.value[0].link) {
      return;
    }

    // this.f.take_bill
    let picUrls = [];
    this.f.take_bill.value.forEach(element => {
      element.link ? picUrls.push(element.link) : ''
    });

    this.customersService.addTrackRecord(this.userId, this.referralsId, 
      picUrls, this.f.details.value, this.handleTypes.indexOf(this.f.handle_type.value) || 0).subscribe(
      res => {
        if (res.ok) {
          this.modalController.dismiss();
        //   this.intention = res.data;
        //   this.modalController.dismiss({
        //     'intention': this.intention
        // });
        }
      })
  }

  ImageChange(params) {
    const { files, type, index } = params;
    // this.files = files;
  }

  async fileChange(params) {
    const { files, operationType, index } = params;

    const pu = (fd) => {
      const uplodfile = { data: fd, inProgress: false, progress: 0, index: index };
      this.uploadFile(uplodfile);
    };

    if (!files[index]) return;

    switch (operationType) {
      case 'add':
        new Compressor(this.dataURItoBlob(files[index].url), {
          quality: 0.6,
          convertSize: 500000,
          success(result) {
            const formData = new FormData();

            formData.append('file', result);
            formData.append('dir', 'comment');
            formData.append('fileType', 'image');

            pu(formData);

          },
          error(err) {
            console.log(err.message);
          },
        });

        break;
      case 'remove':
        break;
      default:
        break;
    }
  }

  uploadFile(file) {
    file.inProgress = true;
    if (this.singleLoading === false) {
      this.presentLoader();
      this.singleLoading = true;
    }
    this.uploadService.upload(file.data).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            this.f.take_bill.value[file.index].link = event.body.link;
            this.dismissLoader();
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        this.dismissLoader();
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
