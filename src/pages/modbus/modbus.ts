import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';
import { NabtoService } from '../../app/nabto.service';
import { hexconvert } from './hexconvert';


declare var NabtoError;

class RegisterConfiguration {
  n: string;
  t: string;
  r: string;
  v: string;
}


@IonicPage()
@Component({
  selector: 'page-modbus',
  templateUrl: 'modbus.html'
})


export class ModbusPage {

  registers: string[];
  registerMap: string[];
  
  configuration: object;
  
  device: NabtoDevice;
  deviceName: string;
  
  registerConfigurations: RegisterConfiguration[];

  busy: boolean;
  offline: boolean;
  timer: any;
  spinner: any;
  unavailableStatus: string;
  firstView: boolean = true;
  
  constructor(private navCtrl: NavController,
              private nabtoService: NabtoService,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private navParams: NavParams,
              private modalCtrl: ModalController,
	      private app: App) {

    this.device = navParams.get('device');
    this.timer = undefined;
    this.busy = false;

  }

  

  ionViewDidLoad() {
    if(this.device == undefined || this.device == null) {
      this.navCtrl.setRoot('OverviewPage');  // .then(() => {this.navControl.popToRoot()});
      return;     
    }
    this.refresh();
    this.deviceName = device.name;
  }


    
  ionViewDidEnter() {

    if (!this.firstView) {
      this.refresh();
    } else {
      // first time we enter the page, just show the values populated
      // during load (to not invoke device again a few milliseconds
      // after load)
      this.firstView = false;
    }
  }

  refresh() {
    this.busyBegin();
    var self = this;
    this.nabtoService.invokeRpc(this.device.id, "modbus_configuration.json").
      then((state: any) => {


        console.log('data:' + state.data);
        self.configuration = JSON.parse(state.data);

	self.registerConfigurations = self.configuration.r;
	
	console.log('configuration[a]:' + this.configuration.a);
        console.log('configuration[r].length:' + this.configuration.r.length);

	self.registerConfigurations.forEach(function (item, index) {

          console.log("Register" + index + ":" + item.r);
	  self.readHoldingRegisterNumber(1,item.r, (value:number)=> {
	    item.v=value;
	    console.log("index:"+index);
	    console.log("Register:"+self.registerConfigurations[index].v);
	  });
	});
	
	
        this.busyEnd();
	
      }).catch(error => {
        this.busyEnd();
        this.handleError(error);
      });
  }

  
  readHoldingRegisterNumber(address: number, register: string, callback: (data: number) => void) {
    var tmpfunc = (hexdata:string) => {
      console.log("hexdata:" + hexdata);
      var number = hexconvert.hex2dec(hexdata);
      console.log("Hexdata-dec:"+ number);
      callback(number);
    }
    this.readHoldingRegisters(address, register, 1, tmpfunc);
  }
    
  readHoldingRegisters(address: number, register: string, words: number, callback: (data: string) => void) {

    var hexAddress = hexconvert.pad(hexconvert.dec2hex(address),2);
    var modbusCmd = hexAddress + "03" + register + hexconvert.pad(hexconvert.dec2hex(words),4);

    console.log("Modbus command:" + modbusCmd);

    this.nabtoService.invokeRpc(this.device.id, "modbus_function.json",
				{ "bus":0, "address":hexAddress, "data": modbusCmd}).
      then((state: any) => {

	var tmpStr = state.data.substring(6);
	
	console.log("data:" + tmpStr);
	callback(tmpStr);

      }).catch(error => {
	console.log("ERROR:"+error);
        this.busyEnd();
        this.handleError(error);
      });
    
  }

  
  busyBegin() {
    if (!this.busy) {
      this.busy = true;
      this.timer = setTimeout(() => this.showSpinner(), 500);
    }
  }

  busyEnd() {
    this.busy = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    if (this.spinner) {
      this.spinner.dismiss();
      this.spinner = undefined;
    }
  }

  handleError(error: any) {
    console.log(`Handling error: ${error.code}`);
    if (error.code == NabtoError.Code.API_RPC_DEVICE_OFFLINE) {
      this.unavailableStatus = "Device offline";
      this.offline = true;
    } else {
      console.log("ERROR invoking device: " + JSON.stringify(error));
    }
    this.showToast(error.message);
  }

  

  showToast(message: string) {
    var opts = <any>{
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 4000
    };
    let toast = this.toastCtrl.create(opts);
    toast.present();
  }
  
  showSpinner() {
    this.spinner = this.loadingCtrl.create({
      content: "Invoking device...",
    });
    this.spinner.present();
  }

  showSettingsPage() {
    this.navCtrl.push('DeviceSettingsPage', {
      device: this.device
    });
  }

  available() {
    return this.activated && !this.offline;
  }

  unavailable() {
    return !this.activated || this.offline;
  }

  home() {
    this.navCtrl.popToRoot();
  }
  
}
