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
import EliceEditor from './src/EliceEditor'
const RNEliceEditor = requireNativeComponent('RNEliceEditor')

exports.RNEliceEditor = class extends TextInput implements TextInputProps {
  static propTypes = {
    ...TextInput.propTypes
  }
  static defaultProps = {}
  constructor (props) {
    super(props)
  }
  _lastNativeSelection = {
    start: 0,
    end: 0
  }
  focus = () => {
    this.textInput.focus()
  }
  onSelectionChange (event) {
    this.props.onSelectionChangeEvent &&
      this.props.onSelectionChangeEvent(event)
    if (!this.textInput) {
      return
    }
    this._lastNativeSelection = event.nativeEvent.selection
    if (this.props.selection || this.props.selectionState) {
      this.forceUpdate()
    }
  }
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

    const _onChange = event => {
      const text = event.nativeEvent.text
      this.props.onChange && this.props.onChange(event)
      this.props.onChangeText && this.props.onChangeText(text)
      if (!this.textInput) {
        return
      }
      this._lastNativeText = text
      this.forceUpdate()
    }
    const props = {
      ...TextInputProps,
      ...this.props
    }
    return cloneElement(
      wrapper,
      wrapper.props,
      <RNEliceEditor
        ref={textInput => (this.textInput = textInput)}
        onChange={_onChange}
        onSelectionChange={this.onSelectionChange.bind(this)}
        {...props}
      />
    )
  }
}

exports.EliceEditor = EliceEditor
