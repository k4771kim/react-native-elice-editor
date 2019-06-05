import React from "react";
import { Text, TextInput, View, ScrollView } from "react-native";
import hljs from "highlight.js";
import tagsStyles from "./Styles/elice.styl";
import HtmlText from "react-native-htmltotext";
import InputScrollView from "react-native-input-scroll-view";
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
    color: "white",
    height: "100%"

    // maxHeight: 200
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
      <InputScrollView
        contentContainerStyle={{
          flex: 1
        }}
        keyboardAvoidingViewProps={{
          enabled: false
        }}
      >
        <TextInput
          disableFullscreenUI
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          inputAccessoryViewID={this.props.inputAccessoryViewID}
          autoCapitalize="none"
          multiline
          ref={textInput => (this.textInput = textInput)}
          onChangeText={this.handleChangeText.bind(this)}
          onSelectionChange={this.onSelectionChange.bind(this)}
          style={[
            styles.text,
            this.props.style,
            {
              maxHeight: this.props.height - this.props.inputMarginBottom
            }
          ]}
        >
          <HtmlText style={styles.welcome} html={this.state.formattedText} />
        </TextInput>
      </InputScrollView>
    );
  }
}
