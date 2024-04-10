import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  userForm: FormGroup;
  status: string = 'INACTIVE';
  farms;
  farm;

  constructor( private route: ActivatedRoute,
    private loadingController: LoadingController, private toastController: ToastController, private modalControl: ModalController ) { 
    this.userForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, {updateOn: 'change', validators: [ Validators.email, Validators.required]}),
      designation: new FormControl(null, Validators.required),
      phone_number_for_login: new FormControl(null, Validators.required),

      // user_is_active: new FormControl(false, Validators.required),
      // communication: new FormGroup({
      //     phone_call_number: new FormControl(null, Validators.required),
      //     whatsapp_number: new FormControl(null, Validators.required),
      //     sms_number: new FormControl(null, Validators.required),
      //   }),
      // preferred_communication: new FormControl('', Validators.required),
     
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      section_location_id: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.userForm.controls['role'].setValue('admin');
    this.getAllFarms();
  }

  async getAllFarms(){
    // this.farms = this.apiService.farms.value;
    this.farm = this.farms[0];
    this.userForm.controls['section_location_id'].setValue(this.farm['section_location_id']);

    console.log('farms- ', this.farms);
    console.log('farm- ', this.farm);

 }

  onSelectFarm(event){
    for(let farm of this.farms){
      if(farm['section_location_id'] === event.target.value){
        this.farm = farm;
        this.userForm.controls['section_location_id'].setValue(farm['section_location_id']);
        console.log('farm- ', this.farm);
      }
    }
  }
  
  async onClickRegisterUser(){
    console.log('register user- ', this.userForm.value);
    // this.apiService.registerUser(await this.userForm.value).subscribe(result =>{
    //   console.log('result- ', result);
    //   this.onRegisterSpinner().then(() =>{
    //     this.userForm.reset();
    //   });
    // });  
  }

  onClickStatus(event){
    if(event.detail.checked === true){
      this.status = 'ACTIVE';
    }
    else if(event.detail.checked === false){
      this.status = 'INACTIVE';
    }
    this.userForm.controls['user_is_active'].setValue(event.detail.checked);
  }

  async onRegisterSpinner() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'registering user!...',
      duration: 2000
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
    this.showRegisterSuccessToast();
  }

  async showRegisterSuccessToast() {
    const toast = await this.toastController.create({
      cssClass:'custom-info-toast',
      message: 'registered successfully!.',
      icon: 'information-circle',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  onCloseModal(){
    this.modalControl.dismiss();
  }
}
