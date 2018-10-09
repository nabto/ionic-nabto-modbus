import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModbusPage } from './modbus';
@NgModule({
  declarations: [ModbusPage],
  imports: [IonicPageModule.forChild(ModbusPage)],
})
export class ModbusPageModule { }
