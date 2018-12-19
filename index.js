import React from 'react'
import { requireNativeComponent, TextInputProps } from 'react-native'
import PropTypes from 'prop-types'

var EliceEditorProps = {
  name: 'RNEliceEditor',
  propTypes: {
    ...TextInputProps
  }
}

const RNEliceEditor = requireNativeComponent('RNEliceEditor', EliceEditorProps)

export default RNEliceEditor
