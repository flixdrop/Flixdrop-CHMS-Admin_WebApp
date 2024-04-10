import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";
import "chartjs-adapter-date-fns";
import Chart from "chart.js/auto";
import { Subscription, map, switchMap, take } from "rxjs";

@Component({
  selector: "app-visual-stat",
  templateUrl: "./visual-stat.component.html",
  styleUrls: ["./visual-stat.component.scss"],
})
export class VisualStatComponent implements OnInit, OnDestroy {

  @ViewChild('myChart', { static: true }) myChart!: ElementRef;

  public chart!: Chart;

  data: any[];

  animal: any;

  chartUnitCount: number = 10;

  isLoading: boolean = false;

  graphDataSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnDestroy(){
    if(this.graphDataSub){
      this.graphDataSub.unsubscribe();
    }
  }

  ionViewDidEnter() {
    this.isLoading = true;
    this.authService.authenticatedUser.subscribe(user => {
      this.userService.fetchOrganizationDocuments(user['id']).subscribe(data => {
        this.isLoading = false;
      });
    });
    this.refreshContent();
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async (paramMap) => {
      const animalId = await paramMap["params"]["animal"];
      this.animal = animalId;
    });
  }

  removeChartDataSet() {
    if (this.chartUnitCount > 10) {
      this.chartUnitCount = this.chartUnitCount - 10;
      this.refreshContent();
    }
  }

  addChartDataSet() {
    if (this.chartUnitCount >= 10) {
      this.chartUnitCount = this.chartUnitCount + 10;
      this.refreshContent();
    }
  }

  refreshContent() {
    this.data = [];
    this.plotLineChart();
    this.updateChart();
  }

  updateChart = () => {
    this.graphDataSub = this.userService.getGraphData(this.animal).subscribe(resData => {

      let heats : any[] = []; 
      let healths: any[] = [];
      this.userService.userData.subscribe((data: any): any =>{
        if(data['heatEvents'] && data['healthEvents']){
          heats = data['heatEvents'].filter((heatEvent: any):any=> heatEvent.animal.name === this.animal);
          healths = data['healthEvents'].filter((healthEvent: any):any=> healthEvent.animal.name === this.animal);
          }
      });

      let dataFromService : any;
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
            heat: heats.hasOwnProperty(key) ? heats[key]['heatStrength'] : 0,
            health: healths.hasOwnProperty(key) ? healths[key]?.['healthIndex'] : 100
          },
        };
        this.data.push(object);
      }
      this.chart.update();

    });

  };

  plotLineChart = () => {
    const ctx = this.myChart.nativeElement.getContext('2d');

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            tension: 0,
            label: "Feeding",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.feeding",
            },
            fill: true,
            backgroundColor: "#80800050",
            borderColor: "#80800010",
            pointBorderColor: "#80800050"
          },
          {
            tension: 0,
            label: "Other",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.other",
            },
            fill: true,
            backgroundColor: "#f0e68c97",
            borderColor: "#FFE5C410",
          },
          {
            tension: 0,
            label: "Resting",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.resting",
            },
            fill: true,
            backgroundColor: "#dda0dd80",
            borderColor: "#dda0dd10",
          },
          {
            tension: 0,
            label: "Rumination",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.rumination",
            },
            fill: true,
            backgroundColor: "#C8FACD",
            borderColor: "#C8FACD10",
          },
          {
            tension: 0,
            label: "Standing",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.standing",
            },
            fill: true,
            backgroundColor: "#c0c0c0",
            borderColor: "#c0c0c007",
          },

          {
            tension: 0,
            label: "Heat Intensity",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.heat",
            },
            fill: false,
            borderColor: "#7fff00",
            yAxisID: 'percentage'
          },
          {
            tension: 0,
            label: "Health Index",
            data: this.data,
            parsing: {
              xAxisKey: "date",
              yAxisKey: "activity.health",
            },
            fill: false,
            borderColor: "#cd5b5b",
          },
        ],
      },
      options: {
        animation: false,
        aspectRatio: 2.5,
        responsive: true,
        maintainAspectRatio: false,
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
            position: 'left',
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
              drawOnChartArea: false
            },
            min: 0,
            max: 100,
            position: 'right',
            beginAtZero: false,
            type: "linear",
            ticks: {
              stepSize: 10,
              callback: function (value, index, values) {
                return `${value} %`;
              }
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
              padding: 25,
              textAlign: "right",
              font: {
                size: 10,
                weight: "bold",
              },
              usePointStyle: true,
              pointStyle: "circle",
            },
            reverse: true,
          },
          title: {
            display: true,
            text: `Cattle No. ${this.animal} Behaviourals`,
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
      tooltipEl.style.width = "200px";
      tooltipEl.style.background = "rgb(255,255,255)";
      tooltipEl.style.borderRadius = "7px";
      tooltipEl.style.color = "rgb(25,25,25)";
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
      tableHead.style.width = "200px";
      tableHead.style.padding = "0.3rem";
      tableHead.style.boxShadow = 'none';
      tableHead.style.background = "white";
      tableHead.style.boxShadow = "rgba(0, 0, 0, 0.07) 0px 2px 4px 0px inset";
      tableHead.style.fontWeight = "bold";
      tableHead.style.borderRadius = "7px 7px 0px 0px";
      tableHead.style.display = "grid";
      tableHead.style.gridTemplateColumns = "30% 70%";
      tableHead.style.gridTemplateRows = "auto";
      tableHead.style.gap = "0.3rem";

      titleLines.forEach((title: string) => {
        const customTitle: string = title;
        let titleArray = customTitle.split(",");

        const div_1 = document.createElement("div");
        div_1.style.display = "flex";
        div_1.style.alignItems = "flex-end";
        div_1.style.justifyContent = "flex-start";

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
      tableBody.style.boxShadow = "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px";
      bodyLines.forEach((body: string, i: string | number) => {
        const colors = tooltip.labelColors[i];

        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";

        const td = document.createElement("td");
        td.style.padding = "0.3rem";
        td.style.margin = "0.1rem 0.3rem";
        td.style.display = "grid";
        td.style.gridTemplateColumns = "auto 1fr auto auto";
        td.style.gridTemplateRows = "auto";
        td.style.gap = "0.3rem";
        td.style.inset = "0.3rem";
        td.style.borderBottom = "1px solid rgba(0,0,0,0.06)";

        const div_1 = document.createElement("div");
        div_1.style.display = "flex";
        div_1.style.alignItems = "center";
        div_1.style.justifyContent = "center";
        const span = document.createElement("span");
        span.style.background = colors.backgroundColor;
        span.style.borderColor = colors.borderColor;
        span.style.height = "10px";
        span.style.width = "10px";
        span.style.borderRadius = "50%";
        span.style.display = "inline-block";

        const customBody: string = body[0];
        let textArray = customBody.split(":");

        const div_2 = document.createElement("div");
        div_2.style.display = "flex";
        div_2.style.alignItems = "center";
        div_2.style.justifyContent = "flex-start";
        div_2.style.fontSize = "0.7rem";
        const text1 = document.createTextNode(textArray[0]);

        const div_3 = document.createElement("div");
        div_3.style.display = "flex";
        div_3.style.alignItems = "center";
        div_3.style.justifyContent = "flex-end";
        div_3.style.fontSize = "1rem";
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
}
