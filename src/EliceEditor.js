import React from 'react'
import { Text, TextInput, View } from 'react-native'
import Python from './Language/Python'
import { Colors } from './EsprimaHelper'
var esprima = require('esprima')

const styles = {
  input: {
    width: '100%',
    color: 'transparent'
  },
  inputWrapper: {
    position: 'absolute',
    top: 0,
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray'
  },
  text: {
    position: 'absolute',
    top: 0,
    width: '100%',
    color: 'transparent'
  },
  mention: {
    color: 'white'
  }
}

export default class EliceEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inputText: '',
      formattedText: ''
    }
  }
  _lastNativeSelection = {
    start: 0,
    end: 0
  }
  onSelectionChange (event) {
    this.props.onSelectionChangeEvent &&
      this.props.onSelectionChangeEvent(event)
    this._lastNativeSelection = event.nativeEvent.selection
  }
  handleChangeText = inputText => {
    let lastLoc = 0
    const formattedText = []
    let tokenizedText = esprima.tokenize(inputText, {
      tolerant: true,
      range: true,
      loc: true,
      comment: true
    })
    tokenizedText.forEach(object => {
      if (lastLoc !== object.loc.start.column) {
        const errorText = (
          <Text style={{ color: Colors.Error }}>
            {inputText.slice(lastLoc, object.loc.start.column)}
          </Text>
        )
        formattedText.push(errorText)
      }
      const mention = (
        <Text style={{ color: Colors[object.type] }}>{object.value}</Text>
      )
      formattedText.push(mention)
      lastLoc = object.loc.end.column
    })

    if (lastLoc !== inputText.length) {
      const errorText = (
        <Text style={{ color: Colors.Error }}>
          {inputText.slice(lastLoc, inputText.length)}
        </Text>
      )
      formattedText.push(errorText)
    }
    this.setState({ inputText, formattedText })

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
            value={this.state.inputText}
            onSelectionChange={this.onSelectionChange.bind(this)}
            onChangeText={this.handleChangeText}
            autoCapitalize='none'
          />
        </View>
      </View>
    )
  }
}
