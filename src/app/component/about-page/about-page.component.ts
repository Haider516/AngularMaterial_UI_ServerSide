import { AfterViewInit, Component } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TreeWithCheckBoxComponent } from '../tree-with-check-box/tree-with-check-box.component';
import { PaginationMeta, PlayersService } from '../../service/players.service';
import { PlayerTableComponent } from '../player-table/player-table.component';
import { PSLPlayer } from '../../playerInterface';
import { DialogElementsExample } from '../dialog/dialog.component';


const HttpOptions = {
  'headers': new HttpHeaders({
    'Content-Type': 'application/json'
  })
}


@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [ PlayerTableComponent, DialogElementsExample],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})

export class AboutPageComponent implements AfterViewInit {

  products: PSLPlayer[] = [];

  pageMeta: PaginationMeta = { total: 0, pageSize: 5, page: 0, pageCount: 0 };


  constructor(private playerService: PlayersService) { }

  ngAfterViewInit(): void {
    this.playerService.dataChange.subscribe((data: { players: PSLPlayer[]; pagination: PaginationMeta }) => {
      this.products = data.players;
      this.pageMeta = data.pagination;
    });
    debugger;

  }

}