export class Util {
  static readonly MODE_CREATE = "CREATE";
  static readonly MODE_EDIT = "EDIT";

  public static convertToBackendDate(backendDateString: string){
    return backendDateString.replace(/\//g, "-");
  }

  public static convertToBackendString(backendString: string){
    return backendString.replace(/ /g, "-");
  }
}
