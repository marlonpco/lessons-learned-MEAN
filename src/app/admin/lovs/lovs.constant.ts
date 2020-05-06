export class LOVConstant{
  static readonly AREA = "AREA";
  static readonly PROJECTPHASE = "PROJECTPHASE";
  static readonly TECHNOLOGY = "TECHNOLOGY";
  static readonly TYPE = "TYPE";
  static readonly CLASSIFICATION = "CLASSIFICATION";
  static readonly SEVERITY = "SEVERITY";

  static readonly keyValue: {key: string, value:string}[] = [
    { key: LOVConstant.AREA, value: "Area" },
    { key: LOVConstant.PROJECTPHASE, value: "Project Phase" },
    { key: LOVConstant.TECHNOLOGY, value: "Technology" },
    { key: LOVConstant.TYPE, value: "Type" },
    { key: LOVConstant.CLASSIFICATION, value: "Classification" },
    { key: LOVConstant.SEVERITY, value: "Severity" },
  ];
}
