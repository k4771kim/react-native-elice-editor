

package com.reactlibrary;

import android.support.annotation.Nullable;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.textinput.ReactEditText;
import com.facebook.react.views.textinput.ReactTextInputManager;

public class RNEliceEditorManager extends ReactTextInputManager {
    boolean isInitiate = false;
    @Override
    public String getName() {
        return "RNEliceEditor";
    }

    @Override
    public ReactEditText createViewInstance(ThemedReactContext context) {
        return new RNEliceEditor(context);
    }

    @ReactProp(name = "value")
    public void setText(ReactEditText view, @Nullable String value) {
        view.setText(value);
    }

    @ReactProp(name = "defaultValue")
    public void setDefaultValue(ReactEditText view, @Nullable String value) {
        if(!isInitiate){
            view.setText(value);
            isInitiate = true;

        }

    }

}



