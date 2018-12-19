

package com.reactlibrary;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.textinput.ReactEditText;
import com.facebook.react.views.textinput.ReactTextInputManager;

public class RNEliceEditorManager extends ReactTextInputManager {
    @Override
    public String getName() {
        return "RNEliceEditor";
    }

    @Override
    public ReactEditText createViewInstance(ThemedReactContext context) {
        return new RNEliceEditor(context);
    }
}



