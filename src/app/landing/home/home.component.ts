import { Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { combineLatest, Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: "app-home",
  standalone: true,
    imports: [
      CommonModule,
      IonicModule,
      FormsModule,
      TranslateModule,
      RouterModule,
    ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnDestroy {
  @ViewChild("myChart_1", { static: false }) myChart_1: ElementRef;
  @ViewChild("myChart_2", { static: false }) myChart_2: ElementRef;

  ctx_1: CanvasRenderingContext2D;
  ctx_2: CanvasRenderingContext2D;

  private fetchUserDataSub: Subscription;
  private userDataSub: Subscription;
  private farmIdSubscription: Subscription;

  language: string = "English";
  isLoading: boolean;

  alertItems: {
    label: string;
    value: string;
    totalCount: number;
    icon: string;
    counter: number;
    route: string;
  }[] = [];

  chart1Title: string = "";
  chart1Parameter1: string = "";
  chart1Parameter2: string = "";
  chart1Parameter3: string = "";

  chart2Title: string = "";
  chart2Parameter1: string = "";
  chart2Parameter2: string = "";

  animals: any[] = [];
  collars: any[] = [];
  heats: any[] = [];
  healths: any[] = [];
  inseminations: any[] = [];
  pregnancy_checks: any[] = [];
  activities: any[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private translate: TranslateService
  ) { }

  ngOnDestroy(): void {
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }
    if (this.fetchUserDataSub) {
      this.fetchUserDataSub.unsubscribe();
    }
    if (this.farmIdSubscription) {
      this.farmIdSubscription.unsubscribe();
    }
    this.destroyCharts();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.authService.authenticatedUser.subscribe((user) => {
      if (user) {
        this.handleAuthenticatedUser(user["id"], user["role"]);
        this.translate
          .get([
            "Overall Heat & Health Cases",
            "All Animals",
            "Heat",
            "Health",
            "Heat vs Pregnant",
            "Pregnancy",
          ])
          .subscribe((translations) => {
            if (translations) {
              this.chart1Title = translations["Overall Heat & Health Cases"];
              this.chart1Parameter1 = translations["All Animals"];
              this.chart1Parameter2 = translations["Heat"];
              this.chart1Parameter3 = translations["Health"];
              this.chart2Title = translations["Heat vs Pregnant"];
              this.chart2Parameter1 = translations["Heat"];
              this.chart2Parameter2 = translations["Pregnancy"];
            }
          });
      }
    },
      (error) => {
        console.error("Error with translations: ", error);
      }
    );
  }

  handleAuthenticatedUser(userId: string, role: string) {
    if (role === "SUPER_ADMIN") {
      combineLatest([
        this.userService.adminId$,
        this.userService.farmId$,
      ]).subscribe(([adminId, farmId]) => {
        adminId = adminId || "All Admins";
        farmId = farmId || "All Farms";
        this.fetchDataForFarm(adminId, farmId);
      });
    } else if (role === "ADMIN") {
      combineLatest([
        this.userService.adminId$,
        this.userService.farmId$,
      ]).subscribe(([adminId, farmId]) => {
        adminId = adminId || "All Admins";
        farmId = farmId || "All Farms";
        this.fetchDataForFarm(adminId, farmId);
      });
    } else if (role === "USER") {
      combineLatest([this.userService.farmId$]).subscribe(([farmId]) => {
        farmId = farmId || "All Farms";
        this.fetchDataForFarm(userId, farmId);
      });
    }
  }

  fetchDataForFarm(userId: string, farmId: string) {
    this.isLoading = true;
    this.fetchUserDataSub = this.userService
      .fetchOrganizationDocuments(userId)
      .subscribe((data) => {
        if (data) {
          this.animals = data["animals"] || [];
          this.collars = data["collars"] || [];
          this.heats = data["heatEvents"] || [];
          this.healths = data["healthEvents"] || [];
          this.inseminations = data["inseminations"] || [];
          this.pregnancy_checks = data["pregnancy_checks"] || [];
          this.activities = data["activities"] || [];
          this.updateAlertItems(farmId);
          this.createCharts();
          this.isLoading = false;
        }
      },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  updateAlertItems(farmId: string) {
    const currentTime = new Date().getTime();

    this.alertItems = [
      {
        label: "Animals",
        value:
          farmId === "All Farms"
            ? this.animals.length.toString()
            : this.animals
              .filter((animal) => animal.farm.id === farmId)
              .length.toString(),
        totalCount: 0,
        icon: "../../../assets/images/Cattle_Icon.png",
        counter: 0,
        route: "animals",
      },

      {
        label: "Activities",
        value:
          farmId === "All Farms"
            ? this.activities.length.toString()
            : this.activities
              .filter((event) => event.animal.farm.id === farmId)
              .length.toString(),
        totalCount: 0,
        icon: "../../../assets/images/Cattle_Icon.png",
        counter: 0,
        route: "activities",
      },

      {
        label: "Heat Events",
        value:
          farmId === "All Farms"
            ? this.heats
              .filter((event) => {
                const startedAtTime = new Date(event?.detectedAt).getTime();
                return currentTime - startedAtTime < 30 * 24 * 60 * 60 * 1000;
              })
              .length.toString()
            : this.heats
              .filter(
                (event) =>
                  event?.animal.farm.id === farmId &&
                  currentTime - new Date(event?.detectedAt).getTime() <
                  30 * 24 * 60 * 60 * 1000
              )
              .length.toString(),
        totalCount:
          farmId === "All Farms"
            ? this.heats.length
            : this.heats.filter((event) => event?.animal.farm.id === farmId)
              .length,
        icon: "../../../assets/images/Heat_Icon.png",
        counter: 0,
        route: "heats",
      },
      {
        label: "Health Events",
        value:
          farmId === "All Farms"
            ? this.healths
              .filter((event) => {
                const startedAtTime = new Date(event?.detectedAt).getTime();
                return currentTime - startedAtTime < 30 * 24 * 60 * 60 * 1000;
              })
              .length.toString()
            : this.healths
              .filter(
                (event) =>
                  event?.animal.farm.id === farmId &&
                  currentTime - new Date(event?.detectedAt).getTime() <
                  30 * 24 * 60 * 60 * 1000
              )
              .length.toString(),
        totalCount:
          farmId === "All Farms"
            ? this.healths.length
            : this.healths.filter((event) => event?.animal.farm.id === farmId)
              .length,
        icon: "../../../assets/images/Health_Icon.png",
        counter: 0,
        route: "healths",
      },
      {
        label: "Inseminations",
        value:
          farmId === "All Farms"
            ? this.inseminations
              .filter((event) => {
                const startedAtTime = new Date(
                  event?.eventDateTime
                ).getTime();
                return currentTime - startedAtTime < 30 * 24 * 60 * 60 * 1000;
              })
              .length.toString()
            : this.inseminations
              .filter(
                (event) =>
                  event?.animal.farm.id === farmId &&
                  currentTime - new Date(event?.eventDateTime).getTime() <
                  30 * 24 * 60 * 60 * 1000
              )
              .length.toString(),
        totalCount: 0,
        icon: "../../../assets/images/Farm_Icon.png",
        counter: 0,
        route: "inseminations",
      },
      {
        label: "Fertility Ratio",
        value:
          farmId === "All Farms"
            ? this.heats.length.toString() +
            "/" +
            this.pregnancy_checks.length.toString()
            : this.heats
              .filter((event) => {
                const startedAtTime = new Date(event?.detectedAt).getTime();
                return (
                  currentTime - startedAtTime < 30 * 24 * 60 * 60 * 1000 &&
                  event?.animal.farm.id === farmId
                );
              })
              .length.toString() +
            "/" +
            this.pregnancy_checks
              .filter((event) => {
                const startedAtTime = new Date(
                  event?.eventDateTime
                ).getTime();
                return (
                  currentTime - startedAtTime < 30 * 24 * 60 * 60 * 1000 &&
                  event?.animal.farm.id === farmId
                );
              })
              .length.toString(),
        totalCount: 0,
        icon: "../../../assets/images/Farm_Icon.png",
        counter: 0,
        route: "fertilityratio",
      },
      // {
      //   label: "Installations",
      //   value:
      //     farmId === "All Farms"
      //       ? this.collars.length.toString()
      //       : this.collars
      //           .filter((collar) => collar.animal.farm.id === farmId)
      //           .length.toString(),
      //   totalCount: 0,
      //   icon: "../../../assets/images/New Installtions_Icon.png",
      //   counter: 0,
      //   route: "installations",
      // },

      {
        label: "Installations",
        value:
          farmId === "All Farms"
            ? Math.floor(this.collars.length * 0.9).toString()
            : Math.floor(
              this.collars.filter(
                (collar) => collar.animal.farm.id === farmId
              ).length * 0.9
            ).toString(),
        totalCount: 0,
        icon: "../../../assets/images/Installation_Icon.png",
        counter: 0,
        route: "installations",
      },
    ];
  }

  createCharts() {
    // this.isLoading = true;
    if (this.myChart_1 && this.myChart_2) {
      this.destroyCharts();
      this.ctx_1 = this.myChart_1.nativeElement.getContext("2d");
      this.ctx_2 = this.myChart_2.nativeElement.getContext("2d");
      this.plotGraph_1();
      this.plotGraph_2();
    }
  }

  destroyCharts() {
    if (this.ctx_1) {
      this.ctx_1.clearRect(
        0,
        0,
        this.ctx_1.canvas.width,
        this.ctx_1.canvas.height
      );
      Chart.getChart(this.ctx_1).destroy();
    }

    if (this.ctx_2) {
      this.ctx_2.clearRect(
        0,
        0,
        this.ctx_2.canvas.width,
        this.ctx_2.canvas.height
      );
      Chart.getChart(this.ctx_2).destroy();
    }
  }

  formatPercentage(value: number): string {
    const clampedValue = Math.min(Math.max(value, 0), 100);
    return `${clampedValue.toFixed(0)}%`;
  }

  plotGraph_1() {
    new Chart(this.ctx_1, <ChartConfiguration>{
      type: "doughnut",
      data: {
        labels: [
          `${this.chart1Parameter2}`,
          `${this.chart1Parameter3}`
        ],
        datasets: [
          {
            data: [
              +this.alertItems.find((item) => item.label == "Heat Events")
                ?.totalCount,
              +this.alertItems.find((item) => item.label == "Health Events")
                ?.totalCount,
            ],
            spanGaps: 0,
            pointBorderWidth: 0,
            pointBackgroundColor: ["#ffffff", "#ffffff"],
            backgroundColor: ["#fcb045", "#e52d27"],
          },
        ],
      },

      options: {
        borderColor: "white",
        devicePixelRatio: 4,
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "end",
            labels: {
              padding: 10,
              textAlign: "right",
              font: {
                weight: "bolder",
              },
              usePointStyle: true,
              pointStyle: "rect",
            },
            reverse: false,
          },
          title: {
            padding: 10,
            align: "start",
            position: "top",
            display: true,
            text: `${this.chart1Title}`,
            font: {
              weight: "bolder",
            },
          },
          tooltip: {
            position: "average",
          },
        },
      },
    });
  }

  plotGraph_2() {
    new Chart(this.ctx_2, <ChartConfiguration>{
      type: "bar",
      data: {
        labels: [`${this.chart2Title}`],
        datasets: [
          {
            label: `${this.chart2Parameter1}`,
            barPercentage: 1,
            pointBorderWidth: 0,
            pointBackgroundColor: "#ffffff",
            data: [
              +this.alertItems.find((item) => item.label == "Heat Events")
                ?.value,
            ],
            backgroundColor: "#fcb045",
          },
          {
            label: `${this.chart2Parameter2}`,
            barPercentage: 1,
            pointBorderWidth: 0,
            pointBackgroundColor: "#ffffff",
            data: [
              +this.alertItems
                .find((item) => item.label == "Fertility Ratio")
                ?.value.toString()
                .split("/")[1],
            ],
            backgroundColor: "#BA5370",
          },
        ],
      },

      options: {
        indexAxis: "y",
        borderColor: "white",
        devicePixelRatio: 4,
        elements: {
          point: {
            radius: 0,
          },
        },

        scales: {
          x: {
            border: {
              display: false,
            },
            grid: {
              display: true,
            },
            ticks: {
              stepSize: 1,
            },
          },
          y: {
            border: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "end",
            labels: {
              padding: 10,
              textAlign: "right",
              font: {
                weight: "bolder",
              },
              usePointStyle: true,
              pointStyle: "rect",
            },
            reverse: false,
          },
          title: {
            padding: 10,
            align: "start",
            position: "top",
            display: true,
            text: `${this.chart2Title}`,
            font: {
              weight: "bolder",
            },
          },
          tooltip: {
            position: "average",
          },
        },
      },
    });
  }

  getActiveEvents() {
    const currentTime = new Date().getTime();
    const events = {
      heats: this.heats
        .filter((event) => {
          const startedAtTime = new Date(event?.detectedAt).getTime();
          return currentTime - startedAtTime < 30 * 24 * 60 * 60 * 1000;
        }),
      healths: this.healths
        .filter((event) => {
          const startedAtTime = new Date(event?.detectedAt).getTime();
          return currentTime - startedAtTime < 30 * 24 * 60 * 60 * 1000;
        })
    };
    return events;
  }

}
