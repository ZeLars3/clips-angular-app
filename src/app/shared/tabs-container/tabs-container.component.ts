import {
  AfterContentInit,
  Component,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> =
    new QueryList<TabComponent>();

  public ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter((tab) => tab.active);

    if (activeTabs?.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  public selectTab(tab: TabComponent): void {
    this.tabs.toArray().forEach((tab) => (tab.active = false));
    tab.active = true;
  }
}
