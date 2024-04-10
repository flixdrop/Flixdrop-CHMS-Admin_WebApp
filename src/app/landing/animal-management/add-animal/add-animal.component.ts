import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { format, parseISO } from 'date-fns';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-animal',
  templateUrl: './add-animal.component.html',
  styleUrls: ['./add-animal.component.scss']
})
export class AddAnimalComponent implements OnInit {
  
  dateOfEntry: any = '';
  dateOfBirth: any = '';
  lastVaccinationDate: any = '';
  lastDeliveryDate: any = '';
  lastInseminationDate: any = '';
  dateOfExit: any = '';
  breed: any = [];
  mother: any = [];

  opitons: any = {
    "breed": [ "Gir", "Red Sindhi", "Sahiwal", "Jersey", "HF",  "Hallikar", "Amritmahal", "Khillari", "Tharparkar", "Hariana", "Kankrej", "Ongole", "Krishna Valley", "Deoni", "Croos Breed"],
    "mother": ["Nandani", "Sundari", "Sushila", "Nanda", "Budha", "Mundi", "Lali", "Kabri"],
  }
  
  animalForm: FormGroup;

  constructor(private toastController: ToastController,
    ) {
      this.animalForm = new FormGroup({
        source_of_entry: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        date_of_entry: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        name: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        tag_no: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        breed: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        gender: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        date_of_birth: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        location: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        mother_type: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        father_type: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        born_type: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        skin_color: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        average_milk: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        no_of_vaccination: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        last_vaccination_date: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        no_of_delivery: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        last_delivery_date: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        no_of_insemination: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        last_insemination_date: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        reason_of_exit: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        date_of_exit: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        note: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]})
      });    }

  ngOnInit() {
    
    this.breed = this.opitons.breed;
    this.mother = this.opitons.mother;
  }

  onRegisterAnimal(){
    // this.apiService.registerAnimal(this.animalForm.value).subscribe(result =>{
    //   console.log('result- ', result);
    //  });
    this.dateOfEntry= '';
    this.dateOfBirth= '';
    this.lastVaccinationDate= '';
    this.lastDeliveryDate= '';
    this.lastInseminationDate= '';
    this.dateOfExit= '';
  }

  onSelectSource(event){
    console.log('source_of_entry- ', event);
  }

  onSelectBreed(event){
    console.log('breed- ', event);
  }

  onSelectGender(event){
    console.log('gender- ', event);
  }

  onSelectCattleType(event){
    console.log('cattle-type- ', event);
  }

  onSelectLocation(event){
    console.log('location- ', event);
  }

  onSelectMotherType(event){
    console.log('mother-type- ', event);
  }

  onSelectFatherType(event){
    console.log('father-type- ', event);
  }

  onSelectBornType(event){
    console.log('father-type- ', event);
  }

  onSelectDateOfEntry(event){
    this.dateOfEntry = format(parseISO(event.detail.value), 'dd-MM-yyyy');
    this.animalForm.controls['date_of_entry'].setValue(new Date(event.detail.value).toISOString());
  }
  
  onSelectDateOfBirth(event){
    this.dateOfBirth = format(parseISO(event.detail.value), 'dd-MM-yyyy');
    this.animalForm.controls['date_of_birth'].setValue(new Date(event.detail.value).toISOString());
  }
  
  onSelectLastVaccinationDate(event){
    this.lastVaccinationDate = format(parseISO(event.detail.value), 'dd-MM-yyyy');
    this.animalForm.controls['last_vaccination_date'].setValue(new Date(event.detail.value).toISOString());
  }

  onSelectLastDeliveryDate(event){
    this.lastDeliveryDate = format(parseISO(event.detail.value), 'dd-MM-yyyy');
    this.animalForm.controls['last_delivery_date'].setValue(new Date(event.detail.value).toISOString());
  }

  onSelectLastInseminationDate(event){
    this.lastInseminationDate = format(parseISO(event.detail.value), 'dd-MM-yyyy');
    this.animalForm.controls['last_insemination_date'].setValue(new Date(event.detail.value).toISOString());
  }
  
  onSelectDateOfExit(event){
    this.dateOfExit = format(parseISO(event.detail.value), 'dd-MM-yyyy');
    this.animalForm.controls['date_of_exit'].setValue(new Date(event.detail.value).toISOString());
  }
  
  onCreate(){
  this.animalForm.reset();
  }

  async showUploadeFailed(){
    const toast = await this.toastController.create({
      message: 'Upload Failed!.',
      icon: 'information-circle',
      position: 'top',
      color: "danger",
      duration: 2000
    });
    toast.present();
  }

}
