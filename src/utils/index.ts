import * as dom from "dts-dom";

const getTargetItem = (values: string[], targetIndexList: number[]) => {
  const [nameIndex, typeIndex, flagIndex, declareIndex] = targetIndexList;
  const typeTransformObj: Record<string, dom.Type> = {
    String: dom.type.string,
    string: dom.type.string,
    Number: dom.type.number,
    number: dom.type.number,
    double: dom.type.number,
    Double: dom.type.number,
    Int: dom.type.number,
    int: dom.type.number,
    Long: dom.type.number,
    long: dom.type.number,
    Array: dom.type.array("unknown"),
    array: dom.type.array("unknown"),
    Map: dom.type.array("unknown"),
    boolean: dom.type.boolean,
    Boolean: dom.type.boolean,
    JSON: dom.type.string,
    json: dom.type.string,
  };

  const flagTransformObj: Record<string, dom.DeclarationFlags> = {
    否: dom.DeclarationFlags.Optional,
    N: dom.DeclarationFlags.Optional,
    n: dom.DeclarationFlags.Optional,
    no: dom.DeclarationFlags.Optional,
    不: dom.DeclarationFlags.Optional,
  };

  return {
    name: values[nameIndex] || " unknownWord ",
    type: typeTransformObj[values[typeIndex]] || dom.type.unknown,
    flag: flagTransformObj[values[flagIndex]],
    declare: values[declareIndex] || "unknown declare",
  };
};

//返回名称类型必填描述，所在的index

const initItemList = (list: string[]) => {

  const nameReg = /名称|参数/;
  const typeReg = /类型/;
  const flagReg = /是否|必|约束/;
  const declareReg = /描述|说明/;

  const nameIndex = list.findIndex((v) => nameReg.test(v));
  const typeIndex = list.findIndex((v) => typeReg.test(v));
  const flagIndex =
    list.findIndex((v) => flagReg.test(v)) === -1
      ? 99
      : list.findIndex((v) => flagReg.test(v));

  const declareIndex = list.findIndex((v) => declareReg.test(v));
  return [nameIndex, typeIndex, flagIndex, declareIndex];
};

const regTransform = (str: string) => {
  const temp = str.replaceAll(/\t+|\s+/g, " ");
  return temp.split(/\s/);
};

//进行文档转换

export const handelTransport = (inputValue: string) => {
  if (!inputValue) {
    return;
  }

  const valueList = inputValue.split("\n");

  //标题行
  const titleList = regTransform(valueList[0]);
  const targetIndexList = initItemList(titleList);

  if (targetIndexList.includes(-1)) {
    return '';
  }

  const output = dom.create.interface(
    "MyInterface",
    dom.DeclarationFlags.ExportDefault
  );

  output.jsDocComment = "This is interface";

  //去除标题

  valueList.shift();

  let tmpUnknownList: string[] = [];

  //开始遍历

  valueList.forEach((item) => {
    let values = regTransform(item);

    //待转换的行与解析出来的标题行不- -致

    if (values.length !== titleList.length) {
      tmpUnknownList.push(item);
    }

    const target = getTargetItem(values, targetIndexList);

    const result = dom.create.property(target.name, target.type, target.flag);
    if (target.declare) {
      result.jsDocComment = target.declare;
    }

    output.members?.push(result);
  });
};
