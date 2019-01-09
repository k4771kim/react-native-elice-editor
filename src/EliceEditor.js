import React from 'react'
import { TextInput } from 'react-native'
const styles = {
  input: {
    fontSize: 18,
    width: '100%',
    lineHeight: 20,
    color: 'transparent'
  },
  text: {
    fontSize: 18,
    position: 'absolute',
    top: 0,
    lineHeight: 20,

    color: 'transparent'
  }
}

export default class EliceEditor extends React.Component {
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
