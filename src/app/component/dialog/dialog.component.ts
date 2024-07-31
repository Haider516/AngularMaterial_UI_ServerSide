import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PlayersService } from '../../service/players.service';
import { PSLPlayer } from '../../playerInterface';


@Component({
  standalone: true,
  selector: 'dialog-elements-example',
  templateUrl: 'dialog-elements-example.html',

  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    MatDialogTitle,
    ButtonComponent,


  ],
})

export class DialogElementsExample {

  @Input() idNumber!: number; //here is  id
  @Input() type!: string;
  @Input() text!: string;
  @Input() obj!: PSLPlayer | null;

  constructor(public dialog: MatDialog,
    private playerCrudService: PlayersService) {
  }

  // if(this.type === "UPDATE") {
  openDialog() {
    // debugger

    console.log(this.obj, this.idNumber);

    debugger
    if (this.type === "UPDATE") {

      if (this.obj) {
        this.dialog.open(DialogElementsExampleDialog, {
          data: {
            idNumber: this.idNumber,
            obj: this.obj,
            type: this.type,
          }
        });
      } else {
        console.error(`Object not found for index ${this.idNumber}`);
      }
    }
    else {
      this.dialog.open(DialogElementsExampleDialog, {
        data: {
          type: this.type,
        }
      });


    }
  }
}






@Component({
  standalone: true,
  selector: 'dialog-elements-example-dialog',
  templateUrl: './dialog-elements-example-dialog.html',
  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    MatDialogTitle,
    ButtonComponent,
    FormsModule,
    MatSelectModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule,

  ],
  providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }, { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },],
})

//dialog content 
export class DialogElementsExampleDialog {

  model!: PSLPlayer;

  PlayerCategory = [
    'Platinum',
    'Diamond',
    'Gold',
    'Silver',
    'Emerging'
  ]

  PlayerType = [
    'Bowler',
    'Batsman',
    'Wicketkeeper',
    'AllRounder'
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private playerCrudService: PlayersService,
    private ref: MatDialogRef<DialogElementsExampleDialog>) {

  }


  ngOnInit() {
    this.model = {
      name: this.data?.obj?.name ,
      age: this.data?.obj?.age ,
      nationality: this.data?.obj?.nationality ,
      category: this.data?.obj?.category ,
      type: this.data?.obj?.type,
      team: this.data?.obj?.team 
    };
  }


  submitForm() {
    
    // Ensure form is valid
    //getting form data
    const formData: PSLPlayer = {
      name: this.model.name,
      age: this.model.age,
      nationality: this.model.nationality,
      category: this.model.category,
      type: this.model.type,
      team: this.model.team
    };

    if (this.data.type === "UPDATE") {

      const updateData = {
        id: this.data.obj.id,
        name: formData.name,
        age: formData.age,
        nationality: formData.nationality,
        category: formData.category,
        type: formData.type,
        team: formData.team
      }

      console.log('Form Data Submitted:', formData);
      console.log("updateData", updateData, this.data.idNumber);
      this.playerCrudService.updateData(updateData);

    }
    else {

      const addedData = {
        name: formData.name,
        age: formData.age,
        nationality: formData.nationality,
        category: formData.category,
        type: formData.type,
        team: formData.team
      }

      this.playerCrudService.postData(addedData);
    }

    this.ref.close()

  }
}
