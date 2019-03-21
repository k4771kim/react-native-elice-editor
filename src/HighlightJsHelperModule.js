import React from "react";
import { Text } from "react-native";
import styles from "./Styles/a11y-dark.styl";
const SPAN_REGEX = /<\s*span class="(.*?)">(.*?)<\s*\/\s*span>/;
exports.parseAST = inputAST => {
  let key = 0;
  let returnData = [];
  const renderParsedText = (c, v) => {
    return (
      <Text key={`key${key++}`} style={styles[c]}>
        {v}
      </Text>
    );
  };
  const parseChildren = (children, stackedClass) => {
    children.forEach(child => {
      if (child.children?.length > 0) {
        let returnStackedClass = stackedClass;
        stackedClass.push(child.attrs.class);
        parseChildren(child.children, returnStackedClass);
      } else {
        parseObject(child, stackedClass);
      }
    });
  };
  const parseObject = (obj, stackedClass) => {
    console.log(stackedClass);
    let className;

    className = stackedClass[stackedClass.length - 1];
    console.log(className, obj.content);
    returnData.push(renderParsedText(className, obj.content));
  };
  parseChildren(inputAST, []);

  return returnData;
};
exports.parseText = inputText => {
  let key = 0;
  const renderParsedText = (c, v) => {
    return (
      <Text
        key={`key${key++}`}
        style={c !== "normal" ? styles[c] : { color: "white" }}
      >
        {v}
      </Text>
    );
  };
  let returnData = []; // formattedText

  let textData = "";

  textData = inputText;

  while ((matchedRegex = SPAN_REGEX.exec(textData)) !== null) {
    if (matchedRegex.index > 0) {
      returnData.push(textData.slice(0, matchedRegex.index));
    }
    returnData.push(renderParsedText(matchedRegex[1], matchedRegex[2]));
    textData = textData.slice(
      matchedRegex.index + matchedRegex[0].length,
      textData.length
    );
  }
  returnData.push(textData);
  return returnData;
};
