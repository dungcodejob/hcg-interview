import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
} from "@angular/core";

@Directive({
  selector: "[repeat]",
  standalone: true,
})
export class RepeatDirective implements OnInit {
  @Input("repeat") amount = 0;
  private readonly _tpl = inject(TemplateRef);
  private readonly _vcr = inject(ViewContainerRef);

  ngOnInit(): void {
    for (let i = 0; i < this.amount; i++) {
      this._vcr.createEmbeddedView(this._tpl);
    }
  }
}
