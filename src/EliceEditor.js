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
  // handleChangeText = inputText => {
  //   const words = inputText.split(' ')
  //   const formattedText = []
  //   words.forEach(word => {
  //     for (var key in Python) {
  //       if (!word.match(Python[key])) {
  //         console.log(Python[key])
  //         const mention = <Text style={{ color: Color[key] }}>{word}</Text>
  //         return formattedText.push(mention, ' ')
  //       }
  //     }
  //     const mention = <Text style={styles.mention}>{word}</Text>
  //     return formattedText.push(mention, ' ')
  //   })

  //   this.setState({ inputText, formattedText })
  // }

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
        formattedText.push(errorText)
      }
      const mention = (
        <Text style={{ color: Colors[object.type] }}>{object.value}</Text>
      )

      formattedText.push(mention)
      lastLoc = object.loc.end.column
    })

    if (lastLoc !== inputText.length) {
      // error range
      const errorText = (
        <Text style={{ color: Colors.Error }}>
          {inputText.slice(lastLoc, inputText.length)}
        </Text>
      )
      formattedText.push(errorText)
    }
    this.setState({ inputText, formattedText })

    this.props.onChangeText && this.props.onChangeText(inputText)
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
            style={[styles.input, this.props.style]}
            value={this.state.inputText}
            onChangeText={this.handleChangeText}
            autoCapitalize='none'
          />
        </View>
      </View>
    )
  }
}
