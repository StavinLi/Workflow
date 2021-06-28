export default {
  "code": "200",
  "msg": "操作成功",
  "data": [
    {
      //条件id  columnId == 0 为发起人
      "columnId": "1090",
      //columnType == "String" && showType == "3"为多选  columnType == "Double"为区间
      "showType": "1", 
      "showName": "预计采购总费用",
      "columnType": "Double",
      //fixedDownBoxValue 匹配 columnType == "String" && showType == "3"时子选项内容
      "fixedDownBoxValue": ""
    },
    {
      "columnId": "1092",
      "showType": "3",
      "showName": "采购类型",
      "columnType": "String",
      "fixedDownBoxValue": "{\"1\":{\"key\":\"1\",\"value\":\"新开园区集中采购\",\"column\":\"\",\"type\":\"1\"}}" 
    },
    {
      "columnId": "1093",
      "showType": "1",
      "showName": "园区面积",
      "columnType": "Double",
      "fixedDownBoxValue": ""
    }
  ]
}