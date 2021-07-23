import { DomSanitizer } from '@angular/platform-browser'
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'jweixinHtml' })

export class JweixinHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }
    
    transform(value) {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}