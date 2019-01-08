import React, { cloneElement, Component } from 'react'
import {
  TextInput,
  UIManager,
  Text,
  requireNativeComponent,
  TouchableWithoutFeedback,
  TextInputProps
} from 'react-native'
import PropTypes from 'prop-types'
const RNEliceEditor = requireNativeComponent('RNEliceEditor')
export default class extends TextInput {
  static propTypes = {
    ...TextInput.propTypes
  }

  static defaultProps = {}

  render () {
    const wrapper = (
      <TouchableWithoutFeedback
        onPress={() => {
          this.focus()
          console.log(TextInput.props)
        }}
      />
    )
    const wrapperProps = {
      ...TouchableWithoutFeedback.props,
      style: { flex: 1 }
    }
    const props = {
      ...TextInput.props,
      ...this.props
    }

    const _onChange = event => {
      const text = event.nativeEvent.text
      this.props.onChange && this.props.onChange(event)
      this.props.onChangeText && this.props.onChangeText(text)
      if (!this._inputRef) {
        // calling `this.props.onChange` or `this.props.onChangeText`
        // may clean up the input itself. Exits here.
        return
      }
      this._lastNativeText = text
      this.forceUpdate()
    }

    return cloneElement(
      wrapper,
      wrapper.props,
      <RNEliceEditor onChange={this._onChange} {...props} />
    )
  }
}
