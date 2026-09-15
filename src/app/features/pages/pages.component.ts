import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../core/api.service';

interface Page {
  title: string;
  slug: string;
  status: string;
  displayOrder: number;
}

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent implements OnInit {
  columns = ['title', 'slug', 'status', 'displayOrder'];
  pages: Page[] = [];

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<Page[]>('/api/websites/1/pages').subscribe(pages => {
      this.pages = pages;
    });
  }
}
