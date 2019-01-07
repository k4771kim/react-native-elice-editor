import React, { cloneElement, Component } from 'react'
import {
  TextInput,
  UIManager,
  requireNativeComponent,
  TouchableWithoutFeedback,
  TextInputProps
} from 'react-native'
import PropTypes from 'prop-types'
const RNEliceEditor = requireNativeComponent('RNEliceEditor')
const textInputRef = React.createRef()
export default class extends Component {
  render () {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.refs.textInputRef.focus()
        }}
      >
        <RNEliceEditor {...this.props} ref='textInputRef' />
      </TouchableWithoutFeedback>
    )
  }
}
