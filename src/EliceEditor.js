import React from 'react'
import { Text, TextInput, View } from 'react-native'
import Python from './Language/Python'
import { Colors } from './EsprimaHelper'
import hljs from 'highlight.js'
import tagsStyles from './Styles/a11y-dark.styl'
import { parse } from './HighlightJsHelperModule'

var esprima = require('esprima')
const styles = {
  input: {
    width: '100%',
    color: 'transparent',
    letterSpacing: 1
  },
  inputWrapper: {
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  text: {
    position: 'absolute',
    top: 0,
    width: '100%',
    color: 'white',
    letterSpacing: 1
  },
  mention: {
    color: 'white'
  }
}

export default class EliceEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      formattedText: ''
    }
    this._lastNativeSelection = {
      start: 0,
      end: 0
    }
  }
  init = false

  componentWillReceiveProps (nextProps) {
    this.initiate(nextProps.defaultValue)
  }

  initiate (inputText) {
    console.log(inputText)
    let highlightValue = hljs.highlight('javascript', inputText).value
    const formattedText = parse(highlightValue)
    this.setState({ text: inputText, formattedText })
  }
  onSelectionChange (event) {
    this.props.onSelectionChangeEvent &&
      this.props.onSelectionChangeEvent(event)
    this._lastNativeSelection = event.nativeEvent.selection
  }
  handleChangeText = inputText => {
    let highlightValue = hljs.highlight('javascript', inputText).value
    const formattedText = parse(highlightValue)
    this.setState({ text: inputText, formattedText })
    this.props.onChangeTextEvent && this.props.onChangeTextEvent(inputText)
  }

  render () {
    return (
      <View>
        <TextInput
          autoCapitalize='none'
          editable={false}
          multiline
          style={[styles.text, this.props.style]}
        >
          {this.state.formattedText}
        </TextInput>

        <View style={styles.inputWrapper}>
          <TextInput
            {...this.props}
            multiline
            ref={textInput => (this.textInput = textInput)}
            style={[
              styles.input,
              this.props.style,
              { backgroundColor: 'transparent' }
            ]}
            onSelectionChange={this.onSelectionChange.bind(this)}
            onChangeText={this.handleChangeText.bind(this)}
            autoCapitalize='none'
            value={this.state.text}
          />
        </View>
      </View>
    )
  }
}
