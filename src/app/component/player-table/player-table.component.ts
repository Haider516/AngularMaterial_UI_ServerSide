import { AfterViewInit, Component, Input, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef, HostListener } from '@angular/core';
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
  isInputDisabled = false;  // Initialize as disabled
  //filter
  filterValue = ""

  toggleInput() {
    this.isInputDisabled = !this.isInputDisabled;
  }

  constructor(private playerCrudService: PlayersService, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    debugger;
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
    debugger;
    if (changes['data'] || changes['pageData']) {
      this.dataSource.data = this.data;
      if (this.pageData) {
        this.paginator.length = this.pageData.total;
        //  this.pageSize = this.pageData.pageSize;
        //    this.paginator.pageSize = this.pageSize;
        //     this.paginator.pageIndex = this.pageData.page;
      }
      console.log("Paginator length set to:", this.paginator.length);
      console.log("Paginator page size set to:", this.paginator.pageSize);
      this.cdr.detectChanges(); // Manually trigger change detection
      debugger;
    }
  }

  async applyFilter(event: Event) {
    let filterX = (event.target as HTMLInputElement).value;
    if (filterX.length >= 3) {
      this.filterValue = filterX;
      this.toggleInput()
      let x = await this.playerCrudService.filteringData(this.filterValue, this.paginator.pageIndex, this.paginator.pageSize, this.active, this.direction);
      if (x) {
        this.toggleInput()
      }
    }
    else {
      this.filterValue=filterX;
      this.playerCrudService.filteringData(this.filterValue, this.paginator.pageIndex, this.paginator.pageSize, this.active, this.direction);
    }

  }

  
  handleClick() {
    debugger
    console.log("Data", this.data);
    this.playerCrudService.loginUser();
    console.log("Page data:", this.pageData);
  }

  onPaginateChange(event: PageEvent) {
    debugger
    this.playerCrudService.filteringData(this.filterValue, this.paginator.pageIndex, this.paginator.pageSize, this.active, this.direction);

  }

  @HostListener('matSortChange', ['$event'])
  sortChange(e: Sort) {
    console.log('Sort event:', e);
    this.active = e.active
    this.direction = e.direction
   this.playerCrudService.filteringData(this.filterValue, this.paginator.pageIndex, this.paginator.pageSize, this.active, this.direction);
  debugger
  }

}
