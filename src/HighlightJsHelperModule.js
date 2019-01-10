// const SPAN_REGEX = /^<\s*span class="[^>]*">(.*?)<\s*span\/>/g
import React from 'react'
import { Text } from 'react-native'
import styles from './Styles/a11y-dark.styl'
const SPAN_REGEX = /<\s*span class="(.*?)">(.*?)<\s*\/\s*span>/

exports.parse = inputText => {
  let key = 0
  const renderParsedText = (c, v) => {
    return (
      <Text
        key={`key${key++}`}
        style={c !== 'normal' ? styles[c] : { color: 'white' }}
      >
        {v}
      </Text>
    )
  }
  let returnData = [] // formattedText

  let textData = ''

  textData = inputText

  while ((matchedRegex = SPAN_REGEX.exec(textData)) !== null) {
    if (matchedRegex.index > 0) {
      returnData.push(textData.slice(0, matchedRegex.index))
    }
    returnData.push(renderParsedText(matchedRegex[1], matchedRegex[2]))
    textData = textData.slice(
      matchedRegex.index + matchedRegex[0].length,
      textData.length
    )
  }
  returnData.push(textData)
  return returnData
}
