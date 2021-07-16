import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  textDir = 'ltr';

  constructor(
    public translate: TranslateService,
    // public historyHelper: HistoryHelperService,
  ) {
    this.initializeApp();
    // this.setLanguage();
  }

  async initializeApp() {
    // try {
    //   await SplashScreen.hide();
    //  } catch (err) {
    //   console.log('This is normal in a browser', err);
    //  }
  }

  setLanguage() {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');

    // this is to determine the text direction depending on the selected language
    // for the purpose of this example we determine that only arabic and hebrew are RTL.
    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   this.textDir = (event.lang === 'ar' || event.lang === 'iw') ? 'rtl' : 'ltr';
    // });
  }
}
