import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {

  adminForm: FormGroup;
  status: string = 'INACTIVE';
  farms;
  farm;

  constructor(
    private loadingController: LoadingController, private toastController: ToastController, private modalControl: ModalController) {
    this.adminForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, { updateOn: 'change', validators: [Validators.email, Validators.required] }),
      designation: new FormControl(null, Validators.required),
      phone_number_for_login: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      section_location_id: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.adminForm.controls['role'].setValue('admin');
    this.getAllFarms();
  }

  async getAllFarms() {
    // this.farms = this.apiService.farms.value;
    this.farm = this.farms[0];
    this.adminForm.controls['name'].setValue(this.farm['location_name']);
    this.adminForm.controls['section_location_id'].setValue(this.farm['section_location_id']);

    console.log('farms- ', this.farms);
    console.log('farm- ', this.farm);

  }

  onSelectFarm(event) {
    for (let farm of this.farms) {
      if (farm['section_location_id'] === event.target.value) {
        this.farm = farm;
        this.adminForm.controls['name'].setValue(this.farm['location_name']);
        this.adminForm.controls['section_location_id'].setValue(farm['section_location_id']);
        console.log('farm- ', this.farm);
      }
    }
  }

  async onClickRegisterAdmin() {
    console.log('register admin- ', this.adminForm.value);
    // this.apiService.registerUser(await this.adminForm.value).subscribe(result => {
    //   console.log('result- ', result);
    //   this.onRegisterSpinner().then(() => {
    //     this.adminForm.reset();
    //   });
    // });
  }

  onClickStatus(event) {
    if (event.detail.checked === true) {
      this.status = 'ACTIVE';
    }
    else if (event.detail.checked === false) {
      this.status = 'INACTIVE';
    }
    this.adminForm.controls['user_is_active'].setValue(event.detail.checked);
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
      cssClass: 'custom-info-toast',
      message: 'registered successfully!.',
      icon: 'information-circle',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  onCloseModal() {
    this.modalControl.dismiss();
  }

}
