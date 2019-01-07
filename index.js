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
        }}
      />
    )
    const wrapperProps = {
      ...TouchableWithoutFeedback.props,
      style: { flex: 1 }
    }
    const props = {
      ...TextInput.props,
      ...this.props,
      ref: this._setNativeRef
    }

    return cloneElement(
      wrapper,
      wrapper.props,
      <RNEliceEditor
        onFocus={() => {
          console.log(this)
        }}
        {...props}
      />
    )
  }
}
