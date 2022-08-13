export class View {
  constructor(private document: Document) {}
  navTabs = this.document.getElementById("nav-tabs") as HTMLElement;
}
