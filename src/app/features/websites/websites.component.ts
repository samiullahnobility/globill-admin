import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../core/api.service';

interface Website {
  id: number;
  providerId: number;
  name: string;
  domain: string;
  template?: string;
  primaryColor?: string;
  secondaryColor?: string;
  status: number;
  isPublished: boolean;
  publishedAt?: string;
}

@Component({
  selector: 'app-websites',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './websites.component.html',
  styleUrl: './websites.component.scss'
})
export class WebsitesComponent implements OnInit {
  columns = ['name', 'domain', 'template', 'status', 'actions'];
  websites: Website[] = [];

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.loadWebsites();
  }

  publish(website: Website) {
    this.api.post<void>(`/api/websites/${website.id}/publish`, {}).subscribe(() => {
      this.loadWebsites();
    });
  }

  unpublish(website: Website) {
    this.api.post<void>(`/api/websites/${website.id}/unpublish`, {}).subscribe(() => {
      this.loadWebsites();
    });
  }

  private loadWebsites() {
    this.api.get<Website[]>('/api/websites').subscribe(websites => {
      this.websites = websites;
    });
  }
}
