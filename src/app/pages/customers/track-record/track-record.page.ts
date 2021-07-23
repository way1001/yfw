import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadService } from '@app/core/_service/uploader.service';
import { ModalController } from '@ionic/angular';
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
  validationsForm: FormGroup;

  intention: [];
  @Input() referralsId;
  @Input() userId;

  validations = {
    'take_bill': [
      { type: 'required', message: '不能为空，请上传相关跟办图片详情' }
    ],
    'details': [
      { type: 'required', message: '内容不能为空' }
    ]
  };

  constructor(private modalController: ModalController,
    private uploadService: UploadService,
    private customersService: CustomersService) { }

  ngOnInit(): void {
    this.validationsForm = new FormGroup({
      
      'take_bill': new FormControl([]),
      'details': new FormControl('', Validators.required)
    });
    
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

    this.customersService.addTrackRecord(this.userId, this.referralsId, 
      this.f.take_bill.value[0].link, this.f.details.value).subscribe(
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
  }

  async fileChange(params) {
    const { files, operationType, index } = params;

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
        }
        break;
      case 'remove':

        //TODO not delete 7niu
        break;
      default:
        break;
    }
  }

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
    file.inProgress = true;
    this.uploadService.upload(file.data).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
              this.f.take_bill.value[0].link = event.body.link
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
