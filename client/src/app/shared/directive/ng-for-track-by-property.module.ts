import { NgModule } from "@angular/core";
import {
  NgForTrackByIdDirective,
  NgForTrackByIndexDirective,
  NgForTrackByPropertyDirective,
} from "./ng-for-track-by-property.directive";

@NgModule({
  declarations: [
    NgForTrackByPropertyDirective,
    NgForTrackByIndexDirective,
    NgForTrackByIdDirective,
  ],
  exports: [
    NgForTrackByPropertyDirective,
    NgForTrackByIndexDirective,
    NgForTrackByIdDirective,
  ],
})
export class NgForTrackByPropertyModule {}
