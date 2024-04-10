import { Component, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy {

  currentSegment: string = 'segment1';

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

  switchSegmentTo(segment: string){
    this.currentSegment = segment;
  }

}

