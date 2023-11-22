import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("contacts")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("createOrUpdate")
  createOrUpdate(@Query() query: object): any {
    return this.appService.getLead(query);
  }
}
