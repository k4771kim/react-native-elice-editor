package com.reactlibrary;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.AppCompatEditText;
import android.text.Editable;
import android.text.InputFilter;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.TextWatcher;
import android.text.style.BackgroundColorSpan;
import android.text.style.ForegroundColorSpan;
import android.text.style.ReplacementSpan;
import android.util.AttributeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import com.facebook.react.views.textinput.ReactEditText;

public class RNEliceEditor extends ReactEditText{
    public interface OnTextChangedListener {
        void onTextChanged(String text);
    }

    private static final Pattern PATTERN_LINE = Pattern.compile(
			".*\\n");
	private static final Pattern PATTERN_NUMBERS = Pattern.compile("\\b(\\d*[.]?\\d+)\\b");

    private static final Pattern PATTERN_PREPROCESSOR = Pattern.compile(
            "\\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\\b");

	private static final Pattern PATTERN_ENDIF  = Pattern.compile(
			"(?:f|rf|fr)(?:(\"\"\"|''')[\\s\\S]+?\\1|(\"|')(?:\\\\.|(?!\\2)[^\\\\\\r\\n])*\\2)/i");
	private static final Pattern PATTERN_KEYWORDS = Pattern.compile(
			"(?:[rub]|rb|br)?(\"\"\"|''')[\\s\\S]+?\\1/i");
	private static final Pattern PATTERN_BUILTINS = Pattern.compile(
			"(?:[rub]|rb|br)?(\"|')(?:\\\\.|(?!\\1)[^\\\\\\r\\n])*\\1/i");
	private static final Pattern PATTERN_COMMENTS = Pattern.compile("((?:^|\\s)def[ \\t]+)[a-zA-Z_]\\w*(?=\\s*\\()/g");
	private static final Pattern PATTERN_TRAILING_WHITE_SPACE = Pattern.compile("(\\bclass\\s+)\\w+/i");
	private static final Pattern PATTERN_INSERT_UNIFORM = Pattern.compile("(^\\s*)@\\w+(?:\\.\\w+)*/");
    private static final Pattern PATTERN_BUILTIN = Pattern.compile("\\b(__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\\b");
    private static final Pattern PATTERN_BOOLEAN= Pattern.compile("\\b(True|False|None)\\b");
    private static final Pattern PATTERN_NUM = Pattern.compile("(?:\\b(?=\\d)|\\B(?=\\.))(?:0[bo])?(?:(?:\\d|0x[\\da-f])[\\da-f]*\\.?\\d*|\\.\\d+)(?:e[+-]?\\d+)?j?\\b/i");
    private static final Pattern PATTERN_OPER = Pattern.compile("[-+%=]=?|!=|\\*\\*?=?|\\/\\/?=?|<[<=>]?|>[=>]?|[&|^~]/");
    private static final Pattern PATTERN_PUNCTUATION= Pattern.compile("/[{}[/];(),.:]/");


    private final Handler updateHandler = new Handler();
    private final Runnable updateRunnable = new Runnable() {
        @Override
        public void run() {
            Editable e = getText();

            if (onTextChangedListener != null) {
                onTextChangedListener.onTextChanged(
                        removeNonAscii(e.toString()));
            }

            highlightWithoutChange(e);
        }
    };

    private OnTextChangedListener onTextChangedListener;
    private int updateDelay = 1000;
    private int errorLine = 0;
    private boolean dirty = false;
    private boolean modified = true;
    private int colorError;
    private int colorNumber;
    private int colorKeyword;
    private int colorBuiltin;
    private int colorBuiltins;

    private int colorBoolean;
    private int colorNum;
    private int colorOper;
    private int colorPunctuation;

    private int colorComment;
    private int tabWidthInCharacters = 0;
    private int tabWidth = 0;

    public static String removeNonAscii(String text) {
        return text.replaceAll("[^\\x0A\\x09\\x20-\\x7E]", "");
    }

    public RNEliceEditor(Context context) {
        super(context);
        init(context);
    }


    public void setOnTextChangedListener(OnTextChangedListener listener) {
        onTextChangedListener = listener;
    }

    public void setUpdateDelay(int ms) {
        updateDelay = ms;
    }

    public void setTabWidth(int characters) {
        if (tabWidthInCharacters == characters) {
            return;
        }

        tabWidthInCharacters = characters;
        tabWidth = Math.round(getPaint().measureText("m") * characters);
    }

    public boolean hasErrorLine() {
        return errorLine > 0;
    }

    public void setErrorLine(int line) {
        errorLine = line;
    }

    public void updateHighlighting() {
        highlightWithoutChange(getText());
    }

    public boolean isModified() {
        return dirty;
    }

    public void setTextHighlighted(CharSequence text) {
        if (text == null) {
            text = "";
        }

        cancelUpdate();

        errorLine = 0;
        dirty = false;

        modified = false;
        String src = removeNonAscii(text.toString());
        setText(highlight(new SpannableStringBuilder(src)));
        modified = true;

        if (onTextChangedListener != null) {
            onTextChangedListener.onTextChanged(src);
        }
    }

    public String getCleanText() {
        return PATTERN_TRAILING_WHITE_SPACE
                .matcher(getText())
                .replaceAll("");
    }

    public void insertTab() {
        int start = getSelectionStart();
        int end = getSelectionEnd();

        getText().replace(
                Math.min(start, end),
                Math.max(start, end),
                "\t",
                0,
                1);
    }

    public void addUniform(String statement) {
        if (statement == null) {
            return;
        }

        Editable e = getText();
        removeUniform(e, statement);

        Matcher m = PATTERN_INSERT_UNIFORM.matcher(e);
        int start = -1;

        while (m.find()) {
            start = m.end();
        }

        if (start > -1) {
            // add line break before statement because it's
            // inserted before the last line-break
            statement = "\n" + statement;
        } else {
            // add a line break after statement if there's no
            // uniform already
            statement += "\n";

            // add an empty line between the last #endif
            // and the now following uniform
            if ((start = endIndexOfLastEndIf(e)) > -1) {
                statement = "\n" + statement;
            }

            // move index past line break or to the start
            // of the text when no #endif was found
            ++start;
        }

        e.insert(start, statement);
    }

    private void removeUniform(Editable e, String statement) {
        if (statement == null) {
            return;
        }

        String regex = "^(" + statement.replace(" ", "[ \\t]+");
        int p = regex.indexOf(";");
        if (p > -1) {
            regex = regex.substring(0, p);
        }
        regex += ".*\\n)$";

        Matcher m = Pattern.compile(regex, Pattern.MULTILINE).matcher(e);
        if (m.find()) {
            e.delete(m.start(), m.end());
        }
    }

    private int endIndexOfLastEndIf(Editable e) {
        Matcher m = PATTERN_ENDIF.matcher(e);
        int idx = -1;

        while (m.find()) {
            idx = m.end();
        }

        return idx;
    }
    public void setReturnKeyType(String returnKeyType) {

    }
    private void init(Context context) {
        setHorizontallyScrolling(true);

        setFilters(new InputFilter[]{new InputFilter() {
            @Override
            public CharSequence filter(
                    CharSequence source,
                    int start,
                    int end,
                    Spanned dest,
                    int dstart,
                    int dend) {
                if (modified &&
                        end - start == 1 &&
                        start < source.length() &&
                        dstart < dest.length()) {
                    char c = source.charAt(start);

                    if (c == '\n') {
                        return autoIndent(source, dest, dstart, dend);
                    }
                }

                return source;
            }
        }});

        addTextChangedListener(new TextWatcher() {
            private int start = 0;
            private int count = 0;

            @Override
            public void onTextChanged(
                    CharSequence s,
                    int start,
                    int before,
                    int count) {
                this.start = start;
                this.count = count;
            }

            @Override
            public void beforeTextChanged(
                    CharSequence s,
                    int start,
                    int count,
                    int after) {
            }

            @Override
            public void afterTextChanged(Editable e) {
                cancelUpdate();
                convertTabs(e, start, count);

                if (!modified) {
                    return;
                }

                dirty = true;
                updateHandler.postDelayed(updateRunnable, updateDelay);
            }
        });

        setSyntaxColors(context);
        setUpdateDelay(100);
        setTabWidth(2);
    }

    private void setSyntaxColors(Context context) {
        colorError = ContextCompat.getColor(
                context,
                R.color.syntax_error);
        colorNumber = ContextCompat.getColor(
                context,
                R.color.syntax_number);
        colorKeyword = ContextCompat.getColor(
                context,
                R.color.syntax_keyword);
        colorBuiltin = ContextCompat.getColor(
                context,
                R.color.syntax_builtin);
        colorComment = ContextCompat.getColor(
                context,
                R.color.syntax_comment);
        colorBuiltins = ContextCompat.getColor(
                context,
                R.color.editor_text);
        colorBoolean = ContextCompat.getColor(
                context,
                R.color.color_boolean);
        colorNum = ContextCompat.getColor(
                context,
                R.color.color_num);
        colorOper = ContextCompat.getColor(
                context,
                R.color.color_oper);
        colorPunctuation = ContextCompat.getColor(
                context,
                R.color.color_punctuation);
    }

    private void cancelUpdate() {
        updateHandler.removeCallbacks(updateRunnable);
    }

    private void highlightWithoutChange(Editable e) {
        modified = false;
        highlight(e);
        modified = true;
    }

    private Editable highlight(Editable e) {
        try {
            int length = e.length();

            // don't use e.clearSpans() because it will
            // remove too much
            clearSpans(e, length);

            if (length == 0) {
                return e;
            }

            if (errorLine > 0) {
                Matcher m = PATTERN_LINE.matcher(e);

                for (int i = errorLine; i-- > 0 && m.find(); ) {
                    // {} because analyzers don't like for (); statements
                }

                e.setSpan(
                        new BackgroundColorSpan(colorError),
                        m.start(),
                        m.end(),
                        Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            }

            if (length > 4096) {
                return e;
            }

            for (Matcher m = PATTERN_NUMBERS.matcher(e); m.find(); ) {
                e.setSpan(
                        new ForegroundColorSpan(colorNumber),
                        m.start(),
                        m.end(),
                        Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            }

            for (Matcher m = PATTERN_PREPROCESSOR.matcher(e); m.find(); ) {
                e.setSpan(
                        new ForegroundColorSpan(colorKeyword),
                        m.start(),
                        m.end(),
                        Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            }
            for (Matcher m = PATTERN_BUILTIN.matcher(e); m.find(); ) {
                e.setSpan(
                        new ForegroundColorSpan(colorBuiltins),
                        m.start(),
                        m.end(),
                        Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            }
            for (Matcher m = PATTERN_BOOLEAN.matcher(e); m.find(); ) {
                e.setSpan(
                        new ForegroundColorSpan(colorBoolean),
                        m.start(),
                        m.end(),
                        Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            }

            for (Matcher m = PATTERN_NUM.matcher(e); m.find(); ) {
                e.setSpan(
                        new ForegroundColorSpan(colorNum),
                        m.start(),
                        m.end(),
                        Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            }
            for (Matcher m = PATTERN_OPER.matcher(e); m.find(); ) {
                e.setSpan(
                        new ForegroundColorSpan(colorOper),
                        m.start(),
                        m.end(),
                        Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            }
            for (Matcher m = PATTERN_PUNCTUATION.matcher(e); m.find(); ) {
                e.setSpan(
                        new ForegroundColorSpan(colorPunctuation),
                        m.start(),
                        m.end(),
                        Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            }
            for (Matcher m = PATTERN_KEYWORDS.matcher(e); m.find(); ) {
                e.setSpan(
                        new ForegroundColorSpan(colorKeyword),
                        m.start(),
                        m.end(),
                        Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            }

            for (Matcher m = PATTERN_BUILTINS.matcher(e); m.find(); ) {
                e.setSpan(
                        new ForegroundColorSpan(colorBuiltin),
                        m.start(),
                        m.end(),
                        Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            }

            for (Matcher m = PATTERN_COMMENTS.matcher(e); m.find(); ) {
                e.setSpan(
                        new ForegroundColorSpan(colorComment),
                        m.start(),
                        m.end(),
                        Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            }
        } catch (IllegalStateException ex) {
            // raised by Matcher.start()/.end() when
            // no successful match has been made what
            // shouldn't ever happen because of find()
        }

        return e;
    }

    private static void clearSpans(Editable e, int length) {
        // remove foreground color spans
        {
            ForegroundColorSpan spans[] = e.getSpans(
                    0,
                    length,
                    ForegroundColorSpan.class);

            for (int i = spans.length; i-- > 0; ) {
                e.removeSpan(spans[i]);
            }
        }

        // remove background color spans
        {
            BackgroundColorSpan spans[] = e.getSpans(
                    0,
                    length,
                    BackgroundColorSpan.class);

            for (int i = spans.length; i-- > 0; ) {
                e.removeSpan(spans[i]);
            }
        }
    }

    private CharSequence autoIndent(
            CharSequence source,
            Spanned dest,
            int dstart,
            int dend) {
        String indent = "";
        int istart = dstart - 1;

        // find start of this line
        boolean dataBefore = false;
        int pt = 0;

        for (; istart > -1; --istart) {
            char c = dest.charAt(istart);

            if (c == '\n') {
                break;
            }

            if (c != ' ' && c != '\t') {
                if (!dataBefore) {
                    // indent always after those characters
                    if (c == '{' ||
                            c == '+' ||
                            c == '-' ||
                            c == '*' ||
                            c == '/' ||
                            c == '%' ||
                            c == '^' ||
                            c == '=') {
                        --pt;
                    }

                    dataBefore = true;
                }

                // parenthesis counter
                if (c == '(') {
                    --pt;
                } else if (c == ')') {
                    ++pt;
                }
            }
        }

        // copy indent of this line into the next
        if (istart > -1) {
            char charAtCursor = dest.charAt(dstart);
            int iend;

            for (iend = ++istart; iend < dend; ++iend) {
                char c = dest.charAt(iend);

                // auto expand comments
                if (charAtCursor != '\n' &&
                        c == '/' &&
                        iend + 1 < dend &&
                        dest.charAt(iend) == c) {
                    iend += 2;
                    break;
                }

                if (c != ' ' && c != '\t') {
                    break;
                }
            }

            indent += dest.subSequence(istart, iend);
        }

        // add new indent
        if (pt < 0) {
            indent += "\t";
        }

        // append white space of previous line and new indent
        return source + indent;
    }

    private void convertTabs(Editable e, int start, int count) {
        if (tabWidth < 1) {
            return;
        }

        String s = e.toString();

        for (int stop = start + count;
             (start = s.indexOf("\t", start)) > -1 && start < stop;
             ++start) {
            e.setSpan(
                    new TabWidthSpan(tabWidth),
                    start,
                    start + 1,
                    Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        }
    }

    private static class TabWidthSpan extends ReplacementSpan {
        private int width;

        public TabWidthSpan(int width) {
            this.width = width;
        }

        @Override
        public int getSize(
                @NonNull Paint paint,
                CharSequence text,
                int start,
                int end,
                Paint.FontMetricsInt fm) {
            return width;
        }

        @Override
        public void draw(
                @NonNull Canvas canvas,
                CharSequence text,
                int start,
                int end,
                float x,
                int top,
                int y,
                int bottom,
                @NonNull Paint paint) {
        }
    }
}
