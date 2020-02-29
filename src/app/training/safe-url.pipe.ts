import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {

  }

  transform(url): unknown {
    const urlId = url.split('v=');
    const sanitiseurl = 'https://www.youtube.com/embed/' + urlId[1];
    return this.sanitizer.bypassSecurityTrustResourceUrl(sanitiseurl);
  }

}
