import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';
import { Inject } from '@angular/core';
import { PlayersService } from '../../service/players.service';


@Component({
  selector: 'app-dialog-delete',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    MatDialogTitle,
    ButtonComponent,
  ],
  templateUrl: './dialog-delete.component.html',
  styleUrl: './dialog-delete.component.css'
})


export class DialogDeleteComponent {

  @Input() idNumber!: number;

 
  constructor(public dialog: MatDialog) { }

  openDialog() {
    console.log(this.idNumber);
    this.dialog.open(DialogDeleteComponentdialog, {
      data: { idNumber: this.idNumber } // Optionally, pass data to the dialog if needed
    })
  }

}



@Component({
  standalone: true,
  selector: 'dialog-elements-example-dialog',
  templateUrl: './dialog-delete-content.html',
  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    MatDialogTitle,
    ButtonComponent,
   
  ],


})
export class DialogDeleteComponentdialog {
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private playerCrudService: PlayersService,
    private ref: MatDialogRef<DialogDeleteComponentdialog>
  ) { }

  DeleteTableData() {
    const idNumber = this.data.idNumber;
    console.log('Deleting data at index:', idNumber);
    this.playerCrudService.deleteData(idNumber); 
    this.ref.close()
  }


}

