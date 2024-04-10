import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild("myChart_1", { static: false }) myChart_1: ElementRef;
  @ViewChild("myChart_2", { static: false }) myChart_2: ElementRef;
  // @ViewChild("myChart_3", { static: false }) myChart_3: ElementRef;

  ctx_1: CanvasRenderingContext2D;
  ctx_2: CanvasRenderingContext2D;
  // ctx_3: CanvasRenderingContext2D;

  fetchUserDataSub: Subscription;
  userDataSub: Subscription;

  language: string = "English";
  isLoading: boolean = true;
  isGraphLoading: boolean = true;

  farmsCount: Number = 0;
  animalsCount: Number = 0;
  collarsCount: Number = 0;
  heatEventsCount: Number = 0;
  healthEventsCount: Number = 0;

  chart1Title: string = "";
  chart1Parameter1: string = "";
  chart1Parameter2: string = "";
  chart1Parameter3: string = "";

  chart2Title: string = "";
  chart2Parameter1: string = "";
  chart2Parameter2: string = "";

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  ngOnDestroy(): void {
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }
    if (this.fetchUserDataSub) {
      this.fetchUserDataSub.unsubscribe();
    }
    this.destroyCharts();
  }

  ngOnInit() {
    this.userDataSub = this.userService.userData.subscribe((data) => {
      if (data) {
        const currentTime = new Date().getTime();

        this.farmsCount = data.farms ? data.farms.length : 0;
        this.animalsCount = data.animals ? data.animals.length : 0;
        this.collarsCount = data.collars ? data.collars.length : 0;

        this.heatEventsCount = data.heatEvents
          ? data.heatEvents.filter((item) => {
              const startedAtTime = new Date(item.startedAt).getTime();
              return currentTime - startedAtTime < 30 * 24 * 60 * 60 * 1000;
            }).length
          : 0;

        this.healthEventsCount = data.healthEvents
          ? data.healthEvents.filter((item) => {
              const startedAtTime = new Date(item.startedAt).getTime();
              return currentTime - startedAtTime < 30 * 24 * 60 * 60 * 1000;
            }).length
          : 0;
      }
    });

    this.translate.get(['Overall Heat & Health Cases', 'All Animals', 'Heat', 'Health', 'Heat vs Pregnant', 'Pregnancy']).subscribe(translations => {
      if(translations){
        this.chart1Title = translations['Overall Heat & Health Cases'];
        this.chart1Parameter1 = translations['All Animals'];
        this.chart1Parameter2 = translations['Heat'];
        this.chart1Parameter3 = translations['Health']; 
        this.chart2Title = translations['Heat vs Pregnant'];
        this.chart2Parameter1 = translations['Heat'];
        this.chart2Parameter2 = translations['Pregnancy'];
      }
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.authService.authenticatedUser.subscribe((user) => {
      this.userService
        .fetchOrganizationDocuments(user["id"])
        .subscribe((data) => {
          this.isLoading = false;
          this.createCharts();
        });
    });
  }

  onSelectFarm(event) {
    console.log("Selected Value: ", event.detail.value);
  }

  createCharts() {
    this.destroyCharts();
    this.isGraphLoading = true;
    if (this.myChart_1 && this.myChart_2) {
      this.ctx_1 = this.myChart_1.nativeElement.getContext("2d");
      this.ctx_2 = this.myChart_2.nativeElement.getContext("2d");
      this.plotGraph_1();
      this.plotGraph_2();
    }
    // if (this.myChart_1 && this.myChart_2 && this.myChart_3) {
    //   this.ctx_1 = this.myChart_1.nativeElement.getContext("2d");
    //   this.ctx_2 = this.myChart_2.nativeElement.getContext("2d");
    //   this.ctx_3 = this.myChart_3.nativeElement.getContext("2d");
    //   this.plotGraph_1();
    //   this.plotGraph_2();
    //   this.plotGraph_3();
    // }
    this.isGraphLoading = false;
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

    // if (this.ctx_3) {
    //   this.ctx_3.clearRect(
    //     0,
    //     0,
    //     this.ctx_3.canvas.width,
    //     this.ctx_3.canvas.height
    //   );
    //   Chart.getChart(this.ctx_3).destroy();
    // }
  }

  formatPercentage(value: number): string {
    const clampedValue = Math.min(Math.max(value, 0), 100);
    return `${clampedValue.toFixed(0)}%`;
  }

  plotGraph_1() {
    new Chart(this.ctx_1, <ChartConfiguration>{
      type: "doughnut",
      data: {
        labels: [`${this.chart1Parameter3}`, `${this.chart1Parameter2}`, `${this.chart1Parameter1}`],
        datasets: [
          {
            data: [
              +this.healthEventsCount,
              +this.heatEventsCount,
              +this.animalsCount,
            ],
            backgroundColor: ["#BE3144","#D2DE32", "#3652AD"],
          },
        ],
      },

      options: {
        cutout: 0,
        borderRadius: 4,
        borderWidth: 3,
        borderColor: "white",
        animation: false,
        responsive: true,
        maintainAspectRatio: true,
        devicePixelRatio: 4,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                weight: "bold",
              },
              usePointStyle: true,
              pointStyle: "circle",
            },
            reverse: true,
          },
          title: {
            display: true,
            text: `${this.chart1Title}`,
          },
          tooltip: {
            position: "nearest",
            usePointStyle: true,
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
            barPercentage: 0.5,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: [+this.heatEventsCount],
            backgroundColor: "#D2DE32",
          },
          {
            label: `${this.chart2Parameter2}`,
            barPercentage: 0.5,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: [+0],
            backgroundColor: "#E19898",
          },
        ],
      },

      options: {
        indexAxis: "y",
        borderRadius: 7,
        borderColor: "white",
        animation: false,
        responsive: true,
        maintainAspectRatio: true,
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
            labels: {
              font: {
                weight: "bold",
              },
              usePointStyle: true,
              pointStyle: "circle",
            },
            reverse: true,
          },
          title: {
            display: true,
            text: `${this.chart2Title}`,
          },
          tooltip: {
            position: "nearest",
            usePointStyle: true,
          },
        },
      },
    });
  }

  // plotGraph_3() {
  //   new Chart(this.ctx_3, <ChartConfiguration>{
  //     type: "polarArea",
  //     data: {
  //       labels: [
  //         "Successful Pregnancy",
  //         "Expected Insemination",
  //         "Verified On Time Insemination",
  //       ],

  //       datasets: [
  //         {
  //           data: [
  //             this.signedInUser["pregnant_animals_count"],
  //             this.signedInUser["inseminations"]["length"],
  //             (this.signedInUser["pregnant_animals_count"] /
  //               this.signedInUser["inseminations"]["length"]) *
  //               100,
  //           ],
  //           backgroundColor: ["#98FB9880", "#FFD70080", "#87CEEB80"],
  //         },
  //       ],
  //     },

  //     options: {
  //       borderRadius: 7,
  //       borderWidth: 7,
  //       borderColor: "white",
  //       animation: false,
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       devicePixelRatio: 4,
  //       elements: {
  //         point: {
  //           radius: 0,
  //         },
  //       },
  //       scales: {
  //         x: {
  //           border: {
  //             display: false,
  //           },
  //           grid: {
  //             drawOnChartArea: false,
  //             display: false,
  //           },
  //         },
  //         y: {
  //           border: {
  //             display: false,
  //           },
  //         },
  //       },

  //       plugins: {
  //         legend: {
  //           display: true,
  //           labels: {
  //             font: {
  //               weight: "bold",
  //             },
  //             usePointStyle: true,
  //             pointStyle: "circle",
  //           },
  //           reverse: true,
  //         },
  //         title: {
  //           display: true,
  //           text: `Successful Insemination Prediction`,
  //         },
  //         tooltip: {
  //           position: "nearest",
  //           usePointStyle: true,
  //         },
  //       },
  //     },
  //   });
  // }
}
