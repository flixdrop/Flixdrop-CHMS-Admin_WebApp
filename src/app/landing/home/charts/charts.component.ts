import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";
import "chartjs-adapter-date-fns";
import Chart from "chart.js/auto";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-charts",
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
  templateUrl: "./charts.component.html",
  styleUrls: ["./charts.component.scss"],
})
export class ChartsComponent implements OnInit, OnDestroy {
  userDataSub: Subscription;

  @ViewChild("myChart", { static: false }) myChart!: ElementRef;

  public chart!: Chart;

  data: any[] = [];

  animal: any;

  healthEvents: any[] = [];
  heatEvents: any[] = [];
  inseminations: any[] = [];
  allEvents: any[] = [];

  chartUnitCount: number = 10;

  isLoading: boolean = false;

  graphDataSub: Subscription;

  selectedSegment = "summary";

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private location: Location
  ) { }

  ngOnDestroy() {
    if (this.graphDataSub) {
      this.graphDataSub.unsubscribe();
    }
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.plotLineChart();
    this.refreshContent();
  }

  ionViewDidEnter() {
    this.isLoading = true;
    this.authService.authenticatedUser.subscribe((user) => {
      this.userService
        .fetchOrganizationDocuments(user["id"])
        .subscribe((data) => {
          if (data) {
            this.isLoading = false;
          }
        });
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.paramMap.subscribe(async (paramMap) => {
      if (paramMap) {

        // const animalId = await paramMap["params"]["animal"];
        // const animalId = await paramMap.get["animal"];
        const animalId = paramMap.get('animal'); // Use `get` method to retrieve parameter

        this.animal = animalId;

        if (this.animal) {
          this.userDataSub = this.userService.userData.subscribe(
            async (data) => {
              if (data) {
                this.healthEvents = data["healthEvents"] || [];
                this.heatEvents = data["heatEvents"] || [];
                this.inseminations = data["inseminations"] || [];

                const mapEvent = (event, type, dateField) => {
                  const eventTime = new Date(event[dateField]).getTime();
                  return {
                    ...event,
                    type,
                    sortTime: eventTime,
                  };
                };

                const sortByEventTime = (a, b) => b.sortTime - a.sortTime;

                this.allEvents = [
                  ...(Array.isArray(data["heatEvents"])
                    ? data["heatEvents"]
                      .filter(
                        (event) => event?.animal.collar.name === animalId
                      )
                      .map((event) =>
                        mapEvent(event, "Heat Event", "detectedAt")
                      )
                      .sort(sortByEventTime)
                    : []),

                  ...(Array.isArray(data["healthEvents"])
                    ? data["healthEvents"]
                      .filter(
                        (event) => event?.animal.collar.name === animalId
                      )
                      .map((event) =>
                        mapEvent(event, "Health Event", "detectedAt")
                      )
                      .sort(sortByEventTime)
                    : []),

                  ...(Array.isArray(data["inseminations"])
                    ? data["inseminations"]
                      .filter(
                        (event) => event?.animal.collar.name === animalId
                      )
                      .map((event) =>
                        mapEvent(event, "Insemination", "eventDateTime")
                      )
                      .sort(sortByEventTime)
                    : []),

                  ...(Array.isArray(data["pregnancy_checks"])
                    ? data["pregnancy_checks"]
                      .filter(
                        (event) => event?.animal.collar.name === animalId
                      )
                      .map((event) =>
                        mapEvent(event, "Pregnancy Check", "eventDateTime")
                      )
                      .sort(sortByEventTime)
                    : []),

                  ...(Array.isArray(data["drying_offs"])
                    ? data["drying_offs"]
                      .filter(
                        (event) => event?.animal.collar.name === animalId
                      )
                      .map((event) =>
                        mapEvent(event, "Drying Off", "eventDateTime")
                      )
                      .sort(sortByEventTime)
                    : []),

                  ...(Array.isArray(data["calvedEvents"])
                    ? data["calvedEvents"]
                      .filter(
                        (event) => event?.animal.collar.name === animalId
                      )
                      .map((event) =>
                        mapEvent(event, "Calved Event", "eventDateTime")
                      )
                      .sort(sortByEventTime)
                    : []),
                ];

                this.refreshContent();
                this.isLoading = false;
              }
            }
          );
        }
        else {
          return;
        }
      }
    });
  }

  async goBack() {
    this.location.back();
  }

  async removeChartDataSet() {
    if (this.chartUnitCount > 10) {
      this.chartUnitCount = this.chartUnitCount - 10;
      this.refreshContent();
    }
  }

  async addChartDataSet() {
    if (this.chartUnitCount >= 10) {
      this.chartUnitCount = this.chartUnitCount + 10;
      this.refreshContent();
    }
  }

  async refreshContent() {
    this.data = [];
    this.plotLineChart();
    this.updateChart();
  }

  updateChart = () => {
    this.graphDataSub = this.userService
      .getGraphData(this.animal)
      .subscribe((resData) => {
        if (resData) {
          let heats: any[] = [];
          let healths: any[] = [];
          this.userService.userData.subscribe((data: any): any => {
            if (data["heatEvents"] && data["healthEvents"]) {
              heats = data["heatEvents"].filter(
                (heatEvent: any): any =>
                  heatEvent?.animal.collar.name === this.animal
              );
              healths = data["healthEvents"].filter(
                (healthEvent: any): any =>
                  healthEvent?.animal.collar.name === this.animal
              );
            }
          });

          let dataFromService: any;
          dataFromService = resData;

          const data: any[] = dataFromService.slice(-this.chartUnitCount);

          for (let key in data) {
            const time = {
              Date: data[key]["Date"],
              "Time Interval (UTC)": data[key]["Time Interval (UTC)"],
            };

            const dateStr = time["Date"];
            const timeIntervalStr = time["Time Interval (UTC)"];
            const startTimeStr = timeIntervalStr.split(" - ")[0];
            const [year, month, day] = dateStr.split("-").map(Number);
            const [hours, minutes] = startTimeStr.split(":").map(Number);
            const combinedDate = new Date(year, month - 1, day, hours, minutes);

            let object: any = {
              date: combinedDate,
              activity: {
                feeding: data[key]["Feeding"],
                other: data[key]["Other"],
                resting: data[key]["Resting"],
                rumination: data[key]["Ruminating"],
                standing: data[key]["Standing"],
                heat: heats.hasOwnProperty(key)
                  ? heats[key]["heatStrength"]
                  : 0,
                health: healths.hasOwnProperty(key)
                  ? healths[key]["healthIndex"]
                  : 100,
              },
            };
            this.data.push(object);
          }
          this.chart.update();
        }
      });
  };

  plotLineChart = () => {
    const ctx = this.myChart?.nativeElement?.getContext("2d");

    if (!ctx) {
      console.error("Could not get canvas context.");
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          // {
          //   yAxisID: "percentage",
          //   tension: 0.2,
          //   borderWidth: 10,
          //   label: "Heat Intensity",
          //   data: this.data,
          //   parsing: {
          //     xAxisKey: "date",
          //     yAxisKey: "activity.heat",
          //   },
          //   fill: false,
          //   borderColor: "#87bc45",
          //   pointBorderWidth: 0,
          //   pointBorderColor: "#87bc45",
          //   pointBackgroundColor: "#87bc45",
          // },
          // {
          //   tension: 0.2,
          //   borderWidth: 10,
          //   label: "Health Index",
          //   data: this.data,
          //   parsing: {
          //     xAxisKey: "date",
          //     yAxisKey: "activity.health",
          //   },
          //   fill: false,
          //   borderColor: "#ea5545",
          //   pointBorderWidth: 0,
          //   pointBorderColor: "#ea5545",
          //   pointBackgroundColor: "#ea5545",
          // },

          {
            yAxisID: "percentage",
            tension: 0.1,
            borderWidth: 10,
            label: "Heat Intensity",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.heat",
            },
            pointBorderWidth: 0,
            pointBorderColor: "#DCE35B",
            pointBackgroundColor: "#DCE35B",

            segment: {
              borderColor: ctx => '#DCE35B',
            },
            spanGaps: true,

          },
          {
            tension: 0.1,
            borderWidth: 10,
            label: "Health Index",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.health",
            },
            pointBorderWidth: 0,
            pointBorderColor: "#f85032",
            pointBackgroundColor: "#f85032",
            segment: {
              borderColor: ctx => '#f85032',
            },
            spanGaps: true,
          },
          {
            label: "Feeding",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.feeding",
            },
            fill: false,
            backgroundColor: "#a2ab5880",
            pointBorderWidth: 0,
            pointBorderColor: "#a2ab58",
            pointBackgroundColor: "#a2ab58",
            segment: {
              borderColor: ctx => '#a2ab58',
              borderDash: ctx => [6, 6],
            },
            spanGaps: true,
          },
          {
            label: "Other",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.other",
            },
            fill: true,
            backgroundColor: "#e9d36280",
            pointBorderWidth: 0,
            pointBorderColor: "#e9d362",
            pointBackgroundColor: "#e9d362",
            segment: {
              borderColor: ctx => '#e9d362',
              // borderDash: ctx => [6, 6],
            },
            spanGaps: true,
          },
          {
            label: "Resting",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.resting",
            },
            fill: true,
            backgroundColor: "#1cefff80",
            pointBorderWidth: 0,
            pointBorderColor: "#1cefff",
            pointBackgroundColor: "#1cefff",
            segment: {
              borderColor: ctx => '#1cefff',
              // borderDash: ctx => [6, 6],
            },
            spanGaps: true,
          },
          {
            label: "Rumination",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.rumination",
            },
            fill: false,
            backgroundColor: "#2C536480",
            pointBorderWidth: 0,
            pointBorderColor: "#DA22FF",
            pointBackgroundColor: "#DA22FF",
            segment: {
              borderColor: ctx => '#DA22FF',
              borderDash: ctx => [6, 6],
            },
            spanGaps: true,
          },
          {
            label: "Standing",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.standing",
            },
            fill: true,
            backgroundColor: "#2C536480",
            pointBorderWidth: 0,
            pointBorderColor: "#2C5364",
            pointBackgroundColor: "#2C5364",
            segment: {
              borderColor: ctx => '#2C5364',
              // borderDash: ctx => [6, 6],
            },
            spanGaps: true,
          },
        ],
      },
      options: {
        devicePixelRatio: 4,
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "hour",
            },
            ticks: {
              stepSize: 6,
            },
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
          },
          y: {
            min: 0,
            max: 100,
            position: "left",
            beginAtZero: false,
            type: "linear",
            ticks: {
              stepSize: 10,
            },
            border: {
              display: false,
            },
          },
          percentage: {
            grid: {
              drawOnChartArea: false,
            },
            min: 0,
            max: 100,
            position: "right",
            beginAtZero: false,
            type: "linear",
            ticks: {
              stepSize: 10,
              callback: function (value, index, values) {
                return `${value} %`;
              },
            },
            border: {
              display: false,
            },
          },
        },

        interaction: {
          mode: "index",
          intersect: false,
        },

        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "end",
            labels: {
              padding: 20,
              textAlign: "right",
              font: {
                weight: "bolder",
              },
              usePointStyle: true,
              pointStyle: "rect",
            },
            reverse: true,
          },
          title: {
            padding: 10,
            align: "start",
            position: "top",
            display: true,
            text: `Cattle No. ${this.animal} Behaviourals`,
            font: {
              weight: "bolder",
            },
          },
          tooltip: {
            enabled: false,
            position: "average",
            usePointStyle: true,
            external: this.externalTooltipHandler,
          },
        },
      },
    });
  };

  getOrCreateTooltip = (chart: {
    canvas: {
      parentNode: {
        querySelector: (arg0: string) => any;
        appendChild: (arg0: any) => void;
      };
    };
  }) => {
    let tooltipEl = chart.canvas.parentNode.querySelector("div");

    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.style.width = "250px";
      tooltipEl.style.background = "rgb(255,255,255)";
      tooltipEl.style.borderRadius = "7px";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(-50%, -25%)";

      tooltipEl.style.transition = "all .2s ease-in";

      const table = document.createElement("table");

      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  externalTooltipHandler = (context: any) => {
    const { chart, tooltip } = context;
    const tooltipEl = this.getOrCreateTooltip(chart);
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
    if (tooltip.body) {
      const titleLines = tooltip.title || [];

      const bodyLines = tooltip.body.map((b: { lines: any }) => b.lines);

      const tableHead = document.createElement("div");
      tableHead.style.width = "250px";
      tableHead.style.padding = "1rem";
      tableHead.style.boxShadow = "none";
      tableHead.style.background = "white";
      tableHead.style.boxShadow = "rgba(0, 0, 0, 0.07) 0px 2px 4px 0px inset";
      tableHead.style.fontWeight = "bold";
      tableHead.style.borderRadius = "7px 7px 0px 0px";
      tableHead.style.display = "grid";
      tableHead.style.gridTemplateColumns = "30% 70%";
      tableHead.style.gridTemplateRows = "auto";
      tableHead.style.gap = "0.2rem";

      titleLines.forEach((title: string) => {
        const customTitle: string = title;
        let titleArray = customTitle.split(",");

        const div_1 = document.createElement("div");
        div_1.style.display = "flex";
        div_1.style.alignItems = "flex-end";
        div_1.style.justifyContent = "flex-start";
        div_1.style.whiteSpace = "nowrap";

        const text_1 = document.createTextNode(
          `${titleArray[0]},  ${titleArray[1]}`
        );

        const div_2 = document.createElement("div");
        div_2.style.display = "flex";
        div_2.style.alignItems = "flex-end";
        div_2.style.justifyContent = "flex-end";
        const text_2 = document.createTextNode(titleArray[2]);

        div_1.appendChild(text_1);
        div_2.appendChild(text_2);

        tableHead.appendChild(div_1);
        tableHead.appendChild(div_2);
      });

      const tableBody = document.createElement("tbody");
      tableBody.style.boxShadow =
        "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px";

      bodyLines.forEach((body: string, i: string | number) => {
        const colors = tooltip.labelColors[i];

        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";

        const td = document.createElement("td");
        td.style.display = "grid";
        td.style.gridTemplateColumns = "auto 1fr auto auto";
        td.style.gridTemplateRows = "auto";
        td.style.gap = "1rem";
        td.style.padding = "0 1rem 0.5rem";

        const div_1 = document.createElement("div");
        div_1.style.display = "flex";
        div_1.style.alignItems = "center";
        div_1.style.justifyContent = "center";
        const span = document.createElement("span");
        span.style.background = colors.backgroundColor;
        span.style.height = "10px";
        span.style.width = "10px";
        span.style.display = "inline-block";

        const customBody: string = body[0];
        let textArray = customBody.split(":");

        const div_2 = document.createElement("div");
        div_2.style.display = "flex";
        div_2.style.alignItems = "center";
        div_2.style.justifyContent = "flex-start";
        const text1 = document.createTextNode(textArray[0]);

        const div_3 = document.createElement("div");
        div_3.style.display = "flex";
        div_3.style.alignItems = "center";
        div_3.style.justifyContent = "flex-end";
        div_3.style.fontWeight = "500";
        const text2 = document.createTextNode(textArray[1]);

        const div_4 = document.createElement("div");

        div_1.appendChild(span);
        div_2.appendChild(text1);
        div_3.appendChild(text2);

        td.appendChild(div_1);
        td.appendChild(div_2);
        td.appendChild(div_3);
        td.appendChild(div_4);

        tr.appendChild(td);
        tableBody.appendChild(tr);
      });

      const tableRoot = tooltipEl.querySelector("table");

      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }

      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }
    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + "px";
    tooltipEl.style.top = positionY + tooltip.caretY + "px";
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding =
      tooltip.options.padding + "px" + tooltip.options.padding + "px";
  };

  onSelectChartSegment(event) {
    const value = event.detail.value;
    this.selectedSegment = value;
  }

  getAnimalHealthIndex(animalId: string) {
    const filteredElements = this.healthEvents.filter(
      (element) => element?.animal?.collar?.name === animalId
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
      (element) => element?.animal?.collar?.name === animalId
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
      (element) => element?.animal?.collar?.name === animalId
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
}
