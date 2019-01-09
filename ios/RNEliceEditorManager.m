//
//  RNEliceEditorManager.m
//  RNEliceEditor
//
//  Created by Kim BoGyun on 08/01/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//



#import "RNEliceEditor.h"
//#import "RCTConvert.h"
#import "RNEliceEditorManager.h"

//@implementation RCTConvert (RCTMultilineTextInputView)
//
//@end

@implementation RNEliceEditorManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
    
   return [[RNEliceEditor alloc] initWithBridge:self.bridge];
    
}
@end
