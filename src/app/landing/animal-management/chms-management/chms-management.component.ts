import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chms-management',
  templateUrl: './chms-management.component.html',
  styleUrls: ['./chms-management.component.scss']
})
export class ChmsManagementComponent implements OnInit {

  belt_id = null;
  collars: any = [];
  refreshing: boolean = false;
  farm = 'allAnimals';
  farm_id;
  farms = [];
  animals: any[] = [];
  allAnimals: any[] = [];
  searchTerm = '';
  public results: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.refreshData();
  }
  
  async refreshData() {
    this.refreshing = true;
    // await this.apiService.getAllData().then((data)=>{
    //   this.apiService.animals.subscribe();
    //   this.apiService.farms.subscribe();
    //   this.getAllBelts();
    //   this.allAnimals = this.apiService.animals.value;
    //   this.farms = this.apiService.farms.value;
    //   this.animals = this.allAnimals;
    //   this.results = [...this.animals];
    // });
    this.refreshing = false;
  }

  async getAllData() {
    // return this.apiService.getUserData().subscribe(async (data) => {
    //   const user = await data["data"].GetUser;
    //   const farmArray = await user["section_location_id"];
    //   let users = [];
    //   let farms = [];
    //   let animals = [];

    //   for (const farmKey in await farmArray) {
    //     users = users.concat(await farmArray[farmKey]["owner"]);
    //     farms = farms.concat(await farmArray[farmKey]);
    //     animals = animals.concat(await farmArray[farmKey]["animals"]);
    //   }
    
    // });
  }

  getAllBelts() {
    // this.apiService.getAllBelts().subscribe((data) => {
    //   this.collars = data['data'].GetAllUnassignedBelts;
    // });
  }

  selectCollar(event: any) {
    this.belt_id = event.target.value;
  }

  async assignBelt(animal_id: any) {
    console.log('animal_id- ', animal_id);
    console.log('belt_id- ', this.belt_id);
    // this.apiService.assignBelt(this.belt_id, animal_id).subscribe();
    await this.refreshData();
  }

  async unassignBelt(device_id: any) {
    console.log('cattle_id- ', device_id);
    // this.apiService.unassignBelt(device_id).subscribe();
    await this.refreshData();
  }

  timeStampTODate(timeStamp: any) {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    const date = new Date(timeStamp).getDate();
    const month = monthNames[new Date(timeStamp).getMonth()];
    const year = new Date(timeStamp).getFullYear();
    return `${date} ${month} ${year}`;
  }

  onSelectFarm(event: any) {
    this.animals = [];
    for (let farm of this.farms) {
      if (farm['section_location_id'] === event.target.value) {
        this.farm = farm;
        this.animals = this.farm['animals'];
        this.results = [...this.animals];
      }
      else if (event.target.value === "select-all") {
        this.animals = [];
        this.farm = 'allAnimals';
        this.animals = this.allAnimals;
        this.results = [...this.animals];
      }
    }
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();

    if (!this.animals || this.animals.length === 0) {
      this.results = [];
      return;
    }

    this.results = this.animals.filter((item) => {
      return Object.values(item).some((value: any) => {
        if (value && typeof value === "string") {
          return value.toLowerCase().includes(query);
        } else if (value && typeof value === "object") {
          return Object.values(value).some((nestedValue: any) => {
            if (nestedValue && typeof nestedValue === "string") {
              return nestedValue.toLowerCase().includes(query);
            }
            return false;
          });
        }
        return false;
      });
    });
  }

}
