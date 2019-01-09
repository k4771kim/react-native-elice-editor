import React from 'react'
import { TextInput } from 'react-native'
import Color from './Color'
import Python from './Language/Python'
const styles = {
  input: {
    // fontSize: 18,
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
    // fontSize: 18,
    position: 'absolute',
    top: 0,
    color: 'transparent'
  }
}

export default class EliceEditor extends React.Component {
  handleChangeText = inputText => {
    const words = inputText.split(' ')
    const formattedText = []
    words.forEach(word => {
      for (var key in Python) {
        if (!word.match(Python[key])) {
          const mention = <Text style={{ color: Color[key] }}>{word}</Text>
          return formattedText.push(mention, ' ')
        }
      }
      const mention = <Text style={styles.mention}>{word}</Text>
      return formattedText.push(mention, ' ')
    })

    this.setState({ inputText, formattedText })
  }

  render () {
    return (
      <View>
        <TextInput
          autoCapitalize={false}
          editable={false}
          multiline
          style={styles.text}
        >
          {this.state.formattedText}
        </TextInput>
        <View style={styles.inputWrapper}>
          <TextInput
            multiline
            style={styles.input}
            value={this.state.inputText}
            onChangeText={this.handleChangeText}
            autoCapitalize={false}
          />
        </View>
      </View>
    )
  }
}
