
import { Component, OnInit, Input } from '@angular/core';
import { SidenavMenuService } from './sidenav-menu.service';

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.scss'],
  providers: [SidenavMenuService]
})
export class SidenavMenuComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('menuItems') menuItems;
  // tslint:disable-next-line:no-input-rename
  @Input('menuParentId') menuParentId;
  parentMenu: Array<any>;

  constructor(private sidenavMenuService: SidenavMenuService) { }

  ngOnInit() {
    this.parentMenu = this.menuItems.filter(item => item.parentId === this.menuParentId);
  }

  onClick(menuId) {
    this.sidenavMenuService.toggleMenuItem(menuId);
    this.sidenavMenuService.closeOtherSubMenus(this.menuItems, menuId);
  }

}