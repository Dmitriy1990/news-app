import {
  Component,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NewsService } from './service/news.service';
import { Sources, Article } from './types/news';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'news-app';
  public sources: Sources[] = [];
  public articles: Article[] = [];
  selectedNewsChannel: string = 'rt';
  @ViewChild(MatSidenav) sideNav!: MatSidenav;
  constructor(
    private observer: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private newsApi: NewsService
  ) {}

  ngOnInit(): void {
    this.newsApi.initArticles().subscribe((res: any) => {
      this.articles = res.articles;
    });
    this.newsApi.initSources().subscribe((res: any) => {
      console.log(res);
      this.sources = res.sources;
    });
  }

  ngAfterViewInit(): void {
    this.sideNav.opened = true;
    this.observer.observe(['(max-width:800px)']).subscribe((res) => {
      if (res?.matches) {
        this.sideNav.mode = 'over';
        this.sideNav.close();
      } else {
        this.sideNav.mode = 'side';
        this.sideNav.open();
      }
    });
    this.cdr.detectChanges();
  }

  searchSource(source: any) {
    this.newsApi.getArticlesByID(source.id).subscribe((res: any) => {
      this.articles = res.articles;
      this.selectedNewsChannel = source.name;
    });
  }

  getSources() {}
}
