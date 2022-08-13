export class View {
  navTabs: HTMLElement;
  constructor(private document: Document) {
    this.navTabs = this.document.getElementById("nav-tabs") as HTMLElement;
  }
}
