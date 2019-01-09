const PATTERN_LINE = /.*\\n/
const PATTERN_NUMBERS = /\\b(\\d*[.]?\\d+)\\b/
const PATTERN_KEYWORD = /(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)/
const PATTERN_ENDIF = /(?:f|rf|fr)(?:(\"\"\"|''')[\\s\\S]+?\\1|(\"|')(?:\\\\.|(?!\\2)[^\\\\\\r\\n])*\\2)/i

const PATTERN_COMMENTS = /((?:^|\\s)def[ \\t]+)[a-zA-Z_]\\w*(?=\\s*\\())/
const PATTERN_TRAILING_WHITE_SPACE = /(\\bclass\\s+)\\w+/i
const PATTERN_INSERT_UNIFORM = /(^\\s*)@\\w+(?:\\.\\w+)*/
const PATTERN_BUILTIN = /(__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)/
const PATTERN_BOOLEAN = /(True|False|None)/
const PATTERN_NUM = /(?:\\b(?=\\d)|\\B(?=\\.))(?:0[bo])?(?:(?:\\d|0x[\\da-f])[\\da-f]*\\.?\\d*|\\.\\d+)(?:e[+-]?\\d+)?j?\\b/i
const PATTERN_OPER = /[-+%=]=?|!=|\\*\\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/
const PATTERN_PUNCTUATION = /[{}[/];(),.:]/

export default {
  PATTERN_LINE,
  PATTERN_NUMBERS,
  PATTERN_KEYWORD,
  PATTERN_ENDIF,
  PATTERN_COMMENTS,
  PATTERN_TRAILING_WHITE_SPACE,
  PATTERN_INSERT_UNIFORM,
  PATTERN_BUILTIN,
  PATTERN_BOOLEAN,
  PATTERN_NUM,
  PATTERN_OPER,
  PATTERN_PUNCTUATION
}
