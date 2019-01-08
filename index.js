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
export default class extends Component {
  static propTypes = {
    ...TextInput.propTypes
  }
  static defaultProps = {}
  constructor (props) {
    super(props)
  }
  focus = () => {
    console.log(this)
    this.textInput.focus()
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
    const _onSelectionChange = event => {
      this.props.onSelectionChange && this.props.onSelectionChange(event)

      if (!this.textInput) {
        return
      }

      this._lastNativeSelection = event.nativeEvent.selection

      if (this.props.selection || this.props.selectionState) {
        this.forceUpdate()
      }
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
        onSelectionChange={_onSelectionChange}
        onChange={_onChange}
        {...props}
      />
    )
  }
}
