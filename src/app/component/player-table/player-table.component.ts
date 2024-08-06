import { AfterViewInit, Component, Input, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef, HostListener, ElementRef } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { PSLPlayer } from '../../playerInterface';
import { DialogElementsExample } from '../dialog/dialog.component';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { PaginationMeta, PlayersService } from '../../service/players.service';
import { ButtonComponent } from '../button/button.component';
import { fromEvent, scan, debounce, interval, debounceTime, map, distinctUntilChanged, of, timer, switchMap } from 'rxjs';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-player-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatPaginatorModule,
    DialogElementsExample,
    DialogDeleteComponent,
    ButtonComponent
  ],
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.css']
})

export class PlayerTableComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() data: PSLPlayer[] = [];
  @Input() text!: string;
  @Input() pageData!: PaginationMeta;


  displayedColumns: string[] = ['id', 'name', 'age', 'nationality', 'category', 'type', 'team', 'action'];
  dataSource = new MatTableDataSource<PSLPlayer>();

  // page 
  pageSizeOptions: number[] = [5, 10, 25];
  length: number = 10; // default to 0
  pageSize: number = 5; // default page size

  //sort
  active = "id"
  direction = "asc"
  isInputDisabled = false;

  //filter
  filterValue = ""
  // searchBox = document.getElementById('search');

  //For Search Box Filtering
  searchInput = new Subject<string>();

  //not  required 
  toggleInput() {
    this.isInputDisabled = !this.isInputDisabled;
  }

  constructor(private playerCrudService: PlayersService, private cdr: ChangeDetectorRef) {

    this.searchInput
      .pipe(debounceTime(300))
      .subscribe((searchTerm: string) => {
        // Call your search function here
        this.performSearch(searchTerm);
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource = new MatTableDataSource(this.data);
    if (this.pageData) {
      this.paginator.length = this.pageData.total;
      this.pageSize = this.pageData.pageSize;
      this.paginator.pageSize = this.pageSize;
      this.paginator.pageIndex = this.pageData.page;
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['pageData']) {
      this.dataSource.data = this.data;
      if (this.pageData) {
        this.paginator.length = this.pageData.total ;
      }
      console.log("Paginator length set to:", this.paginator.length);
      console.log("Paginator page size set to:", this.paginator.pageSize);
      this.cdr.detectChanges(); // Manually trigger change detection

    }
  }

  performSearch(searchTerm: string) {
    this.playerCrudService.filteringData(searchTerm, this.paginator.pageIndex, this.paginator.pageSize, this.active, this.direction);
  }

  ngOnDestroy() {
    this.searchInput.complete();
  }

  async applyFilter(event: Event) {
    const filterX = (event.target as HTMLInputElement).value;
    this.filterValue = filterX;
    this.searchInput.next(this.filterValue);

  }


  onPaginateChange(event: PageEvent) {
    this.playerCrudService.filteringData(this.filterValue, this.paginator.pageIndex, this.paginator.pageSize, this.active, this.direction);
  }

  handleClick() {
    console.log("Data", this.data);
    this.playerCrudService.loginUser();
    console.log("Page data:", this.pageData);
  }



  @HostListener('matSortChange', ['$event'])
  sortChange(e: Sort) {
    console.log('Sort event:', e);
    this.active = e.active
    this.direction = e.direction
    this.playerCrudService.filteringData(this.filterValue, this.paginator.pageIndex, this.paginator.pageSize, this.active, this.direction);

  }

}
