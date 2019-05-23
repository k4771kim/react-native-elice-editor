import React from "react";
import { Text, TextInput, View } from "react-native";
import hljs from "highlight.js";
import tagsStyles from "./Styles/elice.styl";
import HtmlText from "react-native-htmltotext";
const styles = {
  input: {
    width: "100%",
    color: "transparent",
    letterSpacing: 1
  },
  inputWrapper: {
    position: "absolute",
    top: 0,
    width: "100%"
  },
  text: {
    width: "100%",
    color: "white"
  },
  mention: {
    color: "white"
  }
};

export default class EliceEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      formattedText: "",
      language: "javascript"
    };
    this._lastNativeSelection = {
      start: 0,
      end: 0
    };
  }
  init = false;

  componentWillReceiveProps(nextProps) {
    this.initiate(nextProps.defaultValue);
    if (nextProps.language) {
      this.setState({ language: nextProps.language });
    }
  }

  initiate(inputText) {
    let highlightValue;
    highlightValue = hljs.highlight(this.state.language, inputText, true).value;
    const formattedText = highlightValue;
    this.setState({ text: inputText, formattedText });
  }
  onSelectionChange(event) {
    this.props.onSelectionChangeEvent &&
      this.props.onSelectionChangeEvent(event);
    this._lastNativeSelection = event.nativeEvent.selection;
  }
  handleChangeText = inputText => {
    let highlightValue;
    highlightValue = hljs.highlight(this.state.language, inputText, true).value;
    const formattedText = highlightValue;
    this.setState({ text: inputText, formattedText });
    this.props.onChangeTextEvent && this.props.onChangeTextEvent(inputText);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TextInput
          {...this.props}
          inputAccessoryViewID={this.props.inputAccessoryViewID}
          autoCapitalize="none"
          multiline
          ref={textInput => (this.textInput = textInput)}
          onChangeText={this.handleChangeText.bind(this)}
          onSelectionChange={this.onSelectionChange.bind(this)}
          style={[styles.text, this.props.style]}
        >
          <HtmlText style={styles.welcome} html={this.state.formattedText} />
        </TextInput>
      </View>
    );
  }
}
