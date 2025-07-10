import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public lat = -0.187673;
  public lng = -78.481747;
  public zoom = 17;

  constructor(public appService: AppService) { }

  ngOnInit() { }

  subscribe() { }

}