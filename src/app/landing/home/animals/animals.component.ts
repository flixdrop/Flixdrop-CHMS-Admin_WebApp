import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ActionSheetController, IonModal, IonicModule } from "@ionic/angular";
import { InputHandlerService } from "src/app/services/input-handler/input-handler.service";
import { SortTableService } from "src/app/services/sort-table/sort-table.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-animals",
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslateModule,
    RouterModule,
  ],
  templateUrl: "./animals.component.html",
  styleUrls: ["./animals.component.scss"],
})
export class AnimalsComponent implements OnInit, OnDestroy {
  @ViewChild(IonModal) modal: IonModal | any;

  fetchUserDataSub: Subscription;
  userDataSub: Subscription;
  getAllAnimalsSub: Subscription;
  getFarmAnimalsSub: Subscription;
  private authUserSubscription: Subscription;

  results: any[] = [];
  animals: any[] = [];

  selectedFarm: string = "";
  activeRange: number = 7;

  sortOrders: { [key: number]: string } = {};
  isLoading: boolean = false;

  heatEvents: any[] = [];
  inseminations: any[] = [];
  pregnantEvents: any[] = [];
  healthEvents: any[] = [];
  milkings: any[] = [];
  calvedEvents: any[] = [];

  startDate: string;
  endDate: string;

  csvdata = [];

  error: string = "";

  typeOfUser: string = "";

  farmId: string | null = null;
  private farmIdSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private inputHandlerService: InputHandlerService,
    private sortHandlerService: SortTableService,
    private actionSheetController: ActionSheetController
  ) {}

  // ngOnDestroy() {
  //   this.csvdata = [];
  //   if (this.getFarmAnimalsSub) {
  //     this.getFarmAnimalsSub.unsubscribe();
  //   }
  //   if (this.getAllAnimalsSub) {
  //     this.getAllAnimalsSub.unsubscribe();
  //   }
  //   if (this.userDataSub) {
  //     this.userDataSub.unsubscribe();
  //   }
  //   if (this.fetchUserDataSub) {
  //     this.fetchUserDataSub.unsubscribe();
  //   }
  //   if (this.farmIdSubscription) {
  //     this.farmIdSubscription.unsubscribe();
  //   }
  // }

  // ionViewWillEnter() {
  //   let userId;
  //   this.isLoading = true;
  //   this.authService.authenticatedUser.subscribe((user) => {
  //     if (user) {
  //       userId = user["id"];
  //       this.isLoading = false;
  //     }
  //   });

  //   this.isLoading = true;
  //   if (!this.fetchUserDataSub) {
  //     this.fetchUserDataSub = this.userService
  //       .fetchOrganizationDocuments(userId)
  //       .subscribe((data) => {
  //         if (data) {
  //           this.isLoading = false;
  //         }
  //       });
  //   }
  // }

  // ngOnInit() {
  //   this.isLoading = true;
  //   if (!this.userDataSub) {
  //     this.userDataSub = this.userService.userData.subscribe((data) => {
  //       if (data) {
  //         this.animals = data["animals"] || [];
  //         this.healthEvents = data["healthEvents"] || [];
  //         this.heatEvents = data["heatEvents"] || [];
  //         this.inseminations = data["inseminations"] || [];
  //         this.pregnantEvents = data["pregnancy_checks"] || [];
  //         this.calvedEvents = data["calvedEvents"] || [];
  //         this.milkings = data["milking"];

  //         this.isLoading = false;
  //       }
  //     });
  //   }

  //   this.isLoading = true;
  //   if (!this.farmIdSubscription) {
  //     this.farmIdSubscription = this.userService.farmId$.subscribe((farmId) => {
  //       if (farmId) {
  //         this.results =
  //           farmId === "All Farms"
  //             ? this.animals
  //             : this.animals.filter((animal) => animal.farm.id === farmId);
  //         this.setRange(7);
  //         this.isLoading = false;
  //       }
  //     });
  //   }
  // }

  // async handleInput(event: any) {
  //   this.isLoading = true;
  //   const value = event.detail.value;
  //   this.results = this.inputHandlerService.handleInput(value, this.animals);
  //   this.isLoading = false;
  // }


  ionViewWillEnter() {
    this.isLoading = true;
    this.authUserSubscription = this.authService.authenticatedUser.subscribe((user) => {
      if (user) {
        this.userService.fetchOrganizationDocuments(user['id']).subscribe(
          () => {
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching organization documents:', error);
            this.isLoading = false;
          }
        );
      } else {
        this.isLoading = false;
      }
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.userDataSub = this.userService.userData.subscribe((data) => {
      if (data) {
        this.animals = data['animals'] || [];
        this.healthEvents = data['healthEvents'] || [];
        this.heatEvents = data['heatEvents'] || [];
        this.inseminations = data['inseminations'] || [];
        this.pregnantEvents = data['pregnancy_checks'] || [];
        this.calvedEvents = data['calvedEvents'] || [];
        this.milkings = data['milking'];

        this.isLoading = false;
      }
    });

    this.farmIdSubscription = this.userService.farmId$.subscribe((farmId) => {
      if (farmId) {
        this.results =
          farmId === 'All Farms'
            ? this.animals
            : this.animals.filter((animal) => animal.farm.id === farmId);
        this.setRange(7);
      }
    });
  }

  ngOnDestroy() {
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }
    if (this.farmIdSubscription) {
      this.farmIdSubscription.unsubscribe();
    }
    if (this.authUserSubscription) {
      this.authUserSubscription.unsubscribe();
    }
  }

  async handleInput(event: any) {
    this.isLoading = true;
    const value = event.detail.value;
    this.results = this.inputHandlerService.handleInput(value, this.animals);
    this.isLoading = false;
  }

  sortTable(columnIndex: number): void {
    this.sortOrders = this.sortHandlerService.sortTable(
      columnIndex,
      "myTable",
      this.sortOrders
    );
  }

  getAnimalHealthIndex(animalId: string) {
    const filteredElements = this.healthEvents.filter(
      (element) => element?.animal?.id === animalId
    );
    if (filteredElements.length === 0) {
      return 0;
    }
    const latestElement = filteredElements.reduce((prev, current) => {
      return new Date(current.detectedAt || "1970-01-01") >
        new Date(prev.detectedAt || "1970-01-01")
        ? current
        : prev;
    });
    return latestElement;
  }

  getAnimalHeatStrength(animalId: string) {
    const filteredElements = this.heatEvents.filter(
      (element) => element?.animal?.id === animalId
    );
    if (filteredElements.length === 0) {
      return 0;
    }
    const latestElement = filteredElements.reduce((prev, current) => {
      return new Date(current.detectedAt || "1970-01-01") >
        new Date(prev.detectedAt || "1970-01-01")
        ? current
        : prev;
    });
    return latestElement;
  }

  getAnimalInsemination(animalId: string) {
    const filteredElements = this.inseminations.filter(
      (element) => element?.animal?.id === animalId
    );
    if (filteredElements.length === 0) {
      return 0;
    }
    const latestElement = filteredElements.reduce((prev, current) => {
      return new Date(current.eventDateTime || "1970-01-01") >
        new Date(prev.eventDateTime || "1970-01-01")
        ? current
        : prev;
    });
    return latestElement;
  }

  getAnimalReproductiveStatus(animalId: string) {
    const filteredElements = this.pregnantEvents.filter(
      (element) => element?.animal?.id === animalId
    );
    if (filteredElements.length === 0) {
      return 0;
    }
    const latestElement = filteredElements.reduce((prev, current) => {
      return new Date(current.eventDateTime || "1970-01-01") >
        new Date(prev.eventDateTime || "1970-01-01")
        ? current
        : prev;
    });
    return latestElement;
  }

  getAnimalCalving(animalId: string) {
    const filteredElements = this.calvedEvents.filter(
      (element) => element?.animal?.id === animalId
    );
    if (filteredElements.length === 0) {
      return 0;
    }
    const latestElement = filteredElements.reduce((prev, current) => {
      return new Date(current.eventDateTime || "1970-01-01") >
        new Date(prev.eventDateTime || "1970-01-01")
        ? current
        : prev;
    });
    return latestElement;
  }

  daysSince(pastDate: any) {
    const pastDateObj: any = new Date(pastDate);
    const currentDateObj: any = new Date();
    const differenceMs = currentDateObj - pastDateObj;
    const daysDifference = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    return daysDifference;
  }

  handleFileInput(files: FileList | null) {
    if (files && files.length > 0) {
      const file = files.item(0);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const contents = e.target?.result as string;
          this.parseCSV(contents);
        };
        reader.readAsText(file, "UTF-8");
      }
    }
  }

  parseCSV(csvContent: string) {
    const lines = csvContent.split(/\r?\n/);
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line !== "") {
        const values = line.match(/("[^"]*"|[^,]+)(?=,|$)/g);
        const entry = {};
        headers.forEach((header, index) => {
          const value = values[index].replace(/^"(.+(?="$))"$/, "$1").trim();
          entry[header.trim()] = value;
        });
        this.csvdata.push(entry);
      }
    }
    console.log(this.csvdata);
  }

  onCLickRegisterAll() {
    if (this.csvdata) {
      for (let val of this.csvdata) {
        if (this.farmId == "") {
          this.error = "Please select a farm first";
        } else if (this.farmId) {
          this.error = "";
        }

        console.log("All Vals:", val);
        this.userService
          .registerAnimal({
            animalName: val["animal_name"],
            farmId: this.farmId,
          })
          .subscribe((animal) => {
            if (animal) {
              console.log("Registered Animal: ", animal);
              this.userService
                .registerCollar({ collarNo: val["collar_id"] })
                .subscribe((collar) => {
                  if (collar) {
                    console.log("Registered Collar: ", collar);
                    console.log("Collar & Animal:", {
                      collarId: collar,
                      animalId: animal,
                    });
                    this.userService
                      .tieCollarToAnimal({
                        collarId: collar.data.createCollar.id,
                        animalId: animal.data.createAnimal.id,
                      })
                      .subscribe((data) => {
                        if (data) {
                          console.log("Tied Collar to Animal Success", data);
                        }
                      });
                  }
                });
            }
          });
      }

      this.isLoading = true;
      this.authService.authenticatedUser.subscribe((user) => {
        this.userDataSub = this.userService
          .fetchOrganizationDocuments(user["id"])
          .subscribe((data: any) => {
            if (data) {
              this.isLoading = false;
              this.modal.dismiss();
            }
          });
      });
    }
  }

  cancelRegistration() {
    this.modal.dismiss();
  }

  filterHeatHealthEventsByDateRange(events: any[], range: number) {
    const now = new Date().getTime();
    const rangeInMs = range * 24 * 60 * 60 * 1000;
    const options: any = { day: "2-digit", month: "2-digit", year: "numeric" };

    this.startDate = new Date(now - rangeInMs).toLocaleDateString(
      "en-GB",
      options
    );
    this.endDate = new Date(now).toLocaleDateString("en-GB", options);

    return events.filter((event) => {
      const eventTime = new Date(event?.startedAt).getTime();
      return now - eventTime <= rangeInMs;
    });
  }

  filterOtherEventsByDateRange(events: any[], range: number) {
    const now = new Date().getTime();
    const rangeInMs = range * 24 * 60 * 60 * 1000;
    const options: any = { day: "2-digit", month: "2-digit", year: "numeric" };

    this.startDate = new Date(now - rangeInMs).toLocaleDateString(
      "en-GB",
      options
    );
    this.endDate = new Date(now).toLocaleDateString("en-GB", options);

    return events.filter((event) => {
      const eventTime = new Date(event?.eventDateTime).getTime();
      return now - eventTime <= rangeInMs;
    });
  }

  async confirmDownload() {
    const actionSheet = await this.actionSheetController.create({
      header: `${this.selectedFarm} Farm Report`,
      subHeader: `Do you want to download pdf ?`,
      backdropDismiss: true,
      buttons: [
        {
          text: "Download",
          handler: async () => {
            this.generatePDF();
          },
        },
        {
          text: "Cancel",
          handler: async () => {},
        },
      ],
    });

    await actionSheet.present();
  }

  async setRange(range: number) {
    this.activeRange = range;

    this.isLoading = true;
    this.authService.authenticatedUser.subscribe((user) => {
      this.userService
        .fetchOrganizationDocuments(user["id"])
        .subscribe((data: any) => {
          if (data) {
            this.isLoading = false;
          }
        });
    });

    this.userDataSub = this.userService.userData.subscribe((data) => {
      if (data) {
        this.heatEvents = this.filterHeatHealthEventsByDateRange(
          data.heatEvents,
          range
        );
        this.inseminations = this.filterOtherEventsByDateRange(
          data.inseminations,
          range
        );
        this.healthEvents = this.filterHeatHealthEventsByDateRange(
          data.healthEvents,
          range
        );
        this.milkings = this.filterOtherEventsByDateRange(data.milking, range);
      }
    });
  }

  generatePDF() {
    const doc = new jsPDF();
    const logo = "../../../../assets/images/chms-logo.png";
    doc.addImage(logo, "PNG", 10, 10, 60, 20);
    const title = `${this.selectedFarm} Cattle Management Report (${this.startDate} - ${this.endDate})`;
    doc.setFontSize(14);
    doc.text(title, 10, 40);

    const head = [
      ["Cattle ID", "Heat", "Insemination", "Pregnancy", "Health", "Milking"],
    ];

    const data = this.results.map((animal) => [
      animal.name,
      this.heatEvents.length > 0
        ? this.heatEvents.filter(
            (heatEvent) => heatEvent.animal.id == animal.id
          ).length
        : "0",
      this.inseminations.length > 0
        ? this.inseminations.filter(
            (insemination) => insemination.animal.id == animal.id
          ).length
        : "0",
      this.pregnantEvents.length > 0
        ? this.pregnantEvents.filter(
            (pregnantEvent) => pregnantEvent.animal.id == animal.id
          ).length
        : "0",
      this.healthEvents.length > 0
        ? this.healthEvents.filter(
            (healthEvent) => healthEvent.animal.id == animal.id
          ).length
        : "0",
      this.milkings
        .filter((milking) => milking.animal.id == animal.id)
        .reduce((total, milking) => total + milking.totalMilk, 0) + " Ltrs",
    ]);

    const totalHeat = this.heatEvents.filter((event) =>
      this.results.some((animal) => animal.id == event.animal.id)
    ).length;
    const totalInseminations = this.inseminations.filter((event) =>
      this.results.some((animal) => animal.id == event.animal.id)
    ).length;
    const totalPregnancies = this.pregnantEvents.filter((event) =>
      this.results.some((animal) => animal.id == event.animal.id)
    ).length;
    const totalHealth = this.healthEvents.filter((event) =>
      this.results.some((animal) => animal.id == event.animal.id)
    ).length;
    const totalMilking = this.milkings
      .filter((event) =>
        this.results.some((animal) => animal.id == event.animal.id)
      )
      .reduce((total, milking) => total + milking.totalMilk, 0);

    const totalsRow = [
      "Total",
      totalHeat,
      totalInseminations,
      totalPregnancies,
      totalHealth,
      totalMilking + " Ltrs",
    ];
    data.push(totalsRow);

    autoTable(doc, {
      startY: 50,
      head: head,
      body: data,
      styles: {
        halign: "center",
        valign: "middle",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        halign: "center",
        valign: "middle",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        halign: "center",
        valign: "middle",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      footStyles: {
        halign: "center",
        valign: "middle",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },

      columnStyles: {
        headStyles: {
          halign: "left",
          valign: "middle",
        },
        0: { halign: "left" },
      },
    });

    doc.save(
      `${this.selectedFarm} Cattle Management Report (${this.startDate} - ${this.endDate}).pdf`
    );
  }
}
