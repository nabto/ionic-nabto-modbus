export class Customization {
  // name of page to navigate to from overview (the essential page of the app)
  public static vendorPage: string = 'ModbusPage';

  // supported device interface - only interact with devices that match exactly this
  public static interfaceId: string = 'DC14A962-39C7-4067-8EC6-6A491E45E283';

  // supported major version of the device interface - only interact with devices that match exactly this
  public static interfaceVersionMajor: number = 1;

  // supported minor version of the device interface - only interact with devices that match at least this
  public static interfaceVersionMinor: number = 0;
}
