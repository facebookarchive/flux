/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is mozilla.org code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 1998
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   emk <VYV03354@nifty.ne.jp>
 *   Daniel Glazman <glazman@netscape.com>
 *   L. David Baron <dbaron@dbaron.org>
 *   Boris Zbarsky <bzbarsky@mit.edu>
 *   Mats Palmgren <mats.palmgren@bredband.net>
 *   Christian Biesinger <cbiesinger@web.de>
 *   Jeff Walden <jwalden+code@mit.edu>
 *   Jonathon Jongsma <jonathon.jongsma@collabora.co.uk>, Collabora Ltd.
 *   Siraj Razick <siraj.razick@collabora.co.uk>, Collabora Ltd.
 *   Daniel Glazman <daniel.glazman@disruptive-innovations.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var kCHARSET_RULE_MISSING_SEMICOLON = "Missing semicolon at the end of @charset rule";
var kCHARSET_RULE_CHARSET_IS_STRING = "The charset in the @charset rule should be a string";
var kCHARSET_RULE_MISSING_WS = "Missing mandatory whitespace after @charset";
var kIMPORT_RULE_MISSING_URL = "Missing URL in @import rule";
var kURL_EOF = "Unexpected end of stylesheet";
var kURL_WS_INSIDE = "Multiple tokens inside a url() notation";
var kVARIABLES_RULE_POSITION = "@variables rule invalid at this position in the stylesheet";
var kIMPORT_RULE_POSITION = "@import rule invalid at this position in the stylesheet";
var kNAMESPACE_RULE_POSITION = "@namespace rule invalid at this position in the stylesheet";
var kCHARSET_RULE_CHARSET_SOF = "@charset rule invalid at this position in the stylesheet";
var kUNKNOWN_AT_RULE = "Unknow @-rule";

/* FROM http://peter.sh/data/vendor-prefixed-css.php?js=1 */

var kCSS_VENDOR_VALUES = {
  "-moz-box":             {"webkit": "-webkit-box",        "presto": "", "trident": "", "generic": "box" },
  "-moz-inline-box":      {"webkit": "-webkit-inline-box", "presto": "", "trident": "", "generic": "inline-box" },
  "-moz-initial":         {"webkit": "",                   "presto": "", "trident": "", "generic": "initial" },
  "flex":                 {"webkit": "-webkit-flex",       "presto": "", "trident": "", "generic": "" },
  "inline-flex":          {"webkit": "-webkit-inline-flex", "presto": "", "trident": "", "generic": "" },

  "linear-gradient": {"webkit20110101":FilterLinearGradient,
                           "webkit": FilterLinearGradient,
                           "presto": FilterLinearGradient,
                           "trident": FilterLinearGradient,
                           "gecko1.9.2": FilterLinearGradient },
  "repeating-linear-gradient": {"webkit20110101":FilterLinearGradient,
                           "webkit": FilterLinearGradient,
                           "presto": FilterLinearGradient,
                           "trident": FilterLinearGradient,
                           "gecko1.9.2": FilterLinearGradient },

  "radial-gradient": {"webkit20110101":FilterRadialGradient,
                           "webkit": FilterRadialGradient,
                           "presto": FilterRadialGradient,
                           "trident": FilterRadialGradient,
                           "gecko1.9.2": FilterRadialGradient },
  "repeating-radial-gradient": {"webkit20110101":FilterRadialGradient,
                           "webkit": FilterRadialGradient,
                           "presto": FilterRadialGradient,
                           "trident": FilterRadialGradient,
                           "gecko1.9.2": FilterRadialGradient }
};

var kCSS_PREFIXED_VALUE = [
  {"gecko": "-moz-box", "webkit": "-moz-box", "presto": "", "trident": "", "generic": "box"}
];

var kCSS_VENDOR_PREFIXES = 
{"lastUpdate":1392220206,"properties":[
{"gecko":"","webkit":"","presto":"","trident":"-ms-accelerator","status":"P"},
{"gecko":"","webkit":"","presto":"-wap-accesskey","trident":"","status":""},
{"gecko":"align-content","webkit":"-webkit-align-content","presto":"","trident":"","status":""},
{"gecko":"align-items","webkit":"-webkit-align-items","presto":"","trident":"","status":""},
{"gecko":"align-self","webkit":"-webkit-align-self","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-alt","presto":"","trident":"","status":""},
{"gecko":"animation","webkit":"-webkit-animation","presto":"","trident":"animation","status":"WD"},
{"gecko":"animation-delay","webkit":"-webkit-animation-delay","presto":"","trident":"animation-delay","status":"WD"},
{"gecko":"animation-direction","webkit":"-webkit-animation-direction","presto":"","trident":"animation-direction","status":"WD"},
{"gecko":"animation-duration","webkit":"-webkit-animation-duration","presto":"","trident":"animation-duration","status":"WD"},
{"gecko":"animation-fill-mode","webkit":"-webkit-animation-fill-mode","presto":"","trident":"animation-fill-mode","status":"ED"},
{"gecko":"animation-iteration-count","webkit":"-webkit-animation-iteration-count","presto":"","trident":"animation-iteration-count","status":"WD"},
{"gecko":"animation-name","webkit":"-webkit-animation-name","presto":"","trident":"animation-name","status":"WD"},
{"gecko":"animation-play-state","webkit":"-webkit-animation-play-state","presto":"","trident":"animation-play-state","status":"WD"},
{"gecko":"animation-timing-function","webkit":"-webkit-animation-timing-function","presto":"","trident":"animation-timing-function","status":"WD"},
{"gecko":"-moz-appearance","webkit":"-webkit-appearance","presto":"","trident":"","status":"CR"},
{"gecko":"backface-visibility","webkit":"-webkit-backface-visibility","presto":"","trident":"backface-visibility","status":"WD"},
{"gecko":"background-clip","webkit":"-webkit-background-clip","presto":"background-clip","trident":"background-clip","status":"WD"},
{"gecko":"","webkit":"-webkit-background-composite","presto":"","trident":"","status":""},
{"gecko":"-moz-background-inline-policy","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"background-origin","webkit":"-webkit-background-origin","presto":"background-origin","trident":"background-origin","status":"WD"},
{"gecko":"","webkit":"background-position-x","presto":"","trident":"-ms-background-position-x","status":""},
{"gecko":"","webkit":"background-position-y","presto":"","trident":"-ms-background-position-y","status":""},
{"gecko":"background-size","webkit":"-webkit-background-size","presto":"background-size","trident":"background-size","status":"WD"},
{"gecko":"","webkit":"","presto":"","trident":"-ms-behavior","status":""},
{"gecko":"-moz-binding","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"","webkit":"-webkit-blend-mode","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-block-progression","status":""},
{"gecko":"","webkit":"-webkit-border-after","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-border-after-color","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-border-after-style","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-border-after-width","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-border-before","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-border-before-color","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-border-before-style","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-border-before-width","presto":"","trident":"","status":"ED"},
{"gecko":"-moz-border-bottom-colors","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"border-bottom-left-radius","webkit":"-webkit-border-bottom-left-radius","presto":"border-bottom-left-radius","trident":"border-bottom-left-radius","status":"WD"},
{"gecko":"border-bottom-right-radius","webkit":"-webkit-border-bottom-right-radius","presto":"border-bottom-right-radius","trident":"border-bottom-right-radius","status":"WD"},
{"gecko":"-moz-border-end","webkit":"-webkit-border-end","presto":"","trident":"","status":"ED"},
{"gecko":"-moz-border-end-color","webkit":"-webkit-border-end-color","presto":"","trident":"","status":"ED"},
{"gecko":"-moz-border-end-style","webkit":"-webkit-border-end-style","presto":"","trident":"","status":"ED"},
{"gecko":"-moz-border-end-width","webkit":"-webkit-border-end-width","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-border-fit","presto":"","trident":"","status":""},
{"gecko":"border-image","webkit":"-webkit-border-image","presto":"-o-border-image","trident":"","status":"WD"},
{"gecko":"-moz-border-left-colors","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"border-radius","webkit":"-webkit-border-radius","presto":"border-radius","trident":"border-radius","status":"WD"},
{"gecko":"-moz-border-right-colors","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"-moz-border-start","webkit":"-webkit-border-start","presto":"","trident":"","status":"ED"},
{"gecko":"-moz-border-start-color","webkit":"-webkit-border-start-color","presto":"","trident":"","status":"ED"},
{"gecko":"-moz-border-start-style","webkit":"-webkit-border-start-style","presto":"","trident":"","status":"ED"},
{"gecko":"-moz-border-start-width","webkit":"-webkit-border-start-width","presto":"","trident":"","status":"ED"},
{"gecko":"-moz-border-top-colors","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"border-top-left-radius","webkit":"-webkit-border-top-left-radius","presto":"border-top-left-radius","trident":"border-top-left-radius","status":"WD"},
{"gecko":"border-top-right-radius","webkit":"-webkit-border-top-right-radius","presto":"border-top-right-radius","trident":"border-top-right-radius","status":"WD"},
{"gecko":"-moz-box-align","webkit":"-webkit-box-align","presto":"","trident":"","status":"WD"},
{"gecko":"","webkit":"-webkit-box-decoration-break","presto":"box-decoration-break","trident":"","status":"WD"},
{"gecko":"-moz-box-direction","webkit":"","presto":"","trident":"","status":"WD"},
{"gecko":"-moz-box-flex","webkit":"-webkit-box-flex","presto":"","trident":"","status":"WD"},
{"gecko":"","webkit":"-webkit-box-flex-group","presto":"","trident":"","status":"WD"},
{"gecko":"","webkit":"-webkit-box-lines","presto":"","trident":"","status":"WD"},
{"gecko":"-moz-box-ordinal-group","webkit":"-webkit-box-ordinal-group","presto":"","trident":"","status":"WD"},
{"gecko":"-moz-box-orient","webkit":"-webkit-box-orient","presto":"","trident":"","status":"WD"},
{"gecko":"-moz-box-pack","webkit":"-webkit-box-pack","presto":"","trident":"","status":"WD"},
{"gecko":"","webkit":"-webkit-box-reflect","presto":"","trident":"","status":""},
{"gecko":"box-shadow","webkit":"-webkit-box-shadow","presto":"box-shadow","trident":"box-shadow","status":"WD"},
{"gecko":"box-sizing","webkit":"-webkit-box-sizing","presto":"box-sizing","trident":"box-sizing","status":"CR"},
{"gecko":"caption-side","webkit":"-epub-caption-side","presto":"caption-side","trident":"caption-side","status":""},
{"gecko":"clip-path","webkit":"-webkit-clip-path","presto":"clip-path","trident":"","status":""},
{"gecko":"","webkit":"-webkit-column-axis","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-column-break-after","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-column-break-before","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-column-break-inside","presto":"","trident":"","status":""},
{"gecko":"-moz-column-count","webkit":"-webkit-column-count","presto":"column-count","trident":"column-count","status":"CR"},
{"gecko":"-moz-column-fill","webkit":"-webkit-column-fill","presto":"column-fill","trident":"column-fill","status":"CR"},
{"gecko":"-moz-column-gap","webkit":"-webkit-column-gap","presto":"column-gap","trident":"column-gap","status":"CR"},
{"gecko":"","webkit":"-webkit-column-progression","presto":"","trident":"","status":""},
{"gecko":"-moz-column-rule","webkit":"-webkit-column-rule","presto":"column-rule","trident":"column-rule","status":"CR"},
{"gecko":"-moz-column-rule-color","webkit":"-webkit-column-rule-color","presto":"column-rule-color","trident":"column-rule-color","status":"CR"},
{"gecko":"-moz-column-rule-style","webkit":"-webkit-column-rule-style","presto":"column-rule-style","trident":"column-rule-style","status":"CR"},
{"gecko":"-moz-column-rule-width","webkit":"-webkit-column-rule-width","presto":"column-rule-width","trident":"column-rule-width","status":"CR"},
{"gecko":"","webkit":"-webkit-column-span","presto":"column-span","trident":"column-span","status":"CR"},
{"gecko":"-moz-column-width","webkit":"-webkit-column-width","presto":"column-width","trident":"column-width","status":"CR"},
{"gecko":"-moz-columns","webkit":"-webkit-columns","presto":"columns","trident":"columns","status":"CR"},
{"gecko":"","webkit":"","presto":"","trident":"-ms-content-zoom-chaining","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-content-zoom-limit","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-content-zoom-limit-max","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-content-zoom-limit-min","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-content-zoom-snap","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-content-zoom-snap-points","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-content-zoom-snap-type","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-content-zooming","status":""},
{"gecko":"-moz-control-character-visibility","webkit":"","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-dashboard-region","presto":"-apple-dashboard-region","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-o-device-pixel-ratio","trident":"","status":""},
{"gecko":"filter","webkit":"-webkit-filter","presto":"filter","trident":"-ms-filter","status":""},
{"gecko":"flex","webkit":"-webkit-flex","presto":"","trident":"-ms-flex","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-flex-align","status":""},
{"gecko":"flex-basis","webkit":"-webkit-flex-basis","presto":"","trident":"","status":""},
{"gecko":"flex-direction","webkit":"-webkit-flex-direction","presto":"","trident":"-ms-flex-direction","status":""},
{"gecko":"flex-flow","webkit":"-webkit-flex-flow","presto":"","trident":"","status":""},
{"gecko":"flex-grow","webkit":"-webkit-flex-grow","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-flex-order","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-flex-pack","status":""},
{"gecko":"flex-shrink","webkit":"-webkit-flex-shrink","presto":"","trident":"","status":""},
{"gecko":"flex-wrap","webkit":"-webkit-flex-wrap","presto":"","trident":"-ms-flex-wrap","status":""},
{"gecko":"-moz-float-edge","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"","webkit":"-webkit-flow-from","presto":"","trident":"-ms-flow-from","status":""},
{"gecko":"","webkit":"-webkit-flow-into","presto":"","trident":"-ms-flow-into","status":""},
{"gecko":"","webkit":"","presto":"-o-focus-opacity","trident":"","status":""},
{"gecko":"-moz-font-feature-settings","webkit":"","presto":"","trident":"font-feature-settings","status":""},
{"gecko":"-moz-font-language-override","webkit":"","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-font-size-delta","presto":"","trident":"","status":""},
{"gecko":"-moz-force-broken-image-icon","webkit":"","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-grid-area","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-grid-auto-columns","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-grid-auto-flow","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-grid-auto-rows","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-grid-column","presto":"","trident":"-ms-grid-column","status":"WD"},
{"gecko":"","webkit":"","presto":"","trident":"-ms-grid-column-align","status":"WD"},
{"gecko":"","webkit":"-webkit-grid-column-end","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-grid-column-span","status":"WD"},
{"gecko":"","webkit":"-webkit-grid-column-start","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-grid-columns","status":"WD"},
{"gecko":"","webkit":"-webkit-grid-row","presto":"","trident":"-ms-grid-row","status":"WD"},
{"gecko":"","webkit":"","presto":"","trident":"-ms-grid-row-align","status":"WD"},
{"gecko":"","webkit":"-webkit-grid-row-end","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-grid-row-span","status":"WD"},
{"gecko":"","webkit":"-webkit-grid-row-start","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-grid-rows","status":"WD"},
{"gecko":"","webkit":"-webkit-grid-template","presto":"","trident":"","status":"WD"},
{"gecko":"","webkit":"-webkit-grid-template-columns","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-grid-template-rows","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-high-contrast-adjust","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-hyphenate-limit-chars","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-hyphenate-limit-lines","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-hyphenate-limit-zone","status":""},
{"gecko":"-moz-hyphens","webkit":"-epub-hyphens","presto":"","trident":"-ms-hyphens","status":"WD"},
{"gecko":"-moz-image-region","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"ime-mode","webkit":"","presto":"","trident":"-ms-ime-mode","status":""},
{"gecko":"","webkit":"","presto":"-wap-input-format","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-wap-input-required","trident":"","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-interpolation-mode","status":""},
{"gecko":"","webkit":"","presto":"-xv-interpret-as","trident":"","status":""},
{"gecko":"justify-content","webkit":"-webkit-justify-content","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-layout-flow","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-layout-grid","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-layout-grid-char","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-layout-grid-line","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-layout-grid-mode","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-layout-grid-type","status":""},
{"gecko":"","webkit":"-webkit-line-clamp","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-o-link","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-o-link-source","trident":"","status":""},
{"gecko":"","webkit":"-webkit-logical-height","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-logical-width","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-margin-after","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-margin-after-collapse","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-margin-before","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-margin-before-collapse","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-margin-bottom-collapse","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-margin-collapse","presto":"","trident":"","status":""},
{"gecko":"-moz-margin-end","webkit":"-webkit-margin-end","presto":"","trident":"","status":"ED"},
{"gecko":"-moz-margin-start","webkit":"-webkit-margin-start","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-margin-top-collapse","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-marquee","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-wap-marquee-dir","trident":"","status":""},
{"gecko":"","webkit":"-webkit-marquee-direction","presto":"","trident":"","status":"WD"},
{"gecko":"","webkit":"-webkit-marquee-increment","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-wap-marquee-loop","trident":"","status":"WD"},
{"gecko":"","webkit":"-webkit-marquee-repetition","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-marquee-speed","presto":"-wap-marquee-speed","trident":"","status":"WD"},
{"gecko":"","webkit":"-webkit-marquee-style","presto":"-wap-marquee-style","trident":"","status":"WD"},
{"gecko":"mask","webkit":"-webkit-mask","presto":"mask","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-box-image","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-box-image-outset","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-box-image-repeat","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-box-image-slice","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-box-image-source","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-box-image-width","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-clip","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-composite","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-image","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-origin","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-position","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-position-x","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-position-y","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-repeat","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-repeat-x","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-repeat-y","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-size","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-mask-source-type","presto":"","trident":"","status":""},
{"gecko":"-moz-math-display","webkit":"","presto":"","trident":"","status":""},
{"gecko":"-moz-math-variant","webkit":"","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-max-logical-height","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-max-logical-width","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-min-logical-height","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-min-logical-width","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"","presto":"-o-mini-fold","trident":"","status":""},
{"gecko":"","webkit":"object-fit","presto":"-o-object-fit","trident":"","status":"ED"},
{"gecko":"","webkit":"","presto":"-o-object-position","trident":"","status":"ED"},
{"gecko":"opacity","webkit":"-webkit-opacity","presto":"opacity","trident":"opacity","status":"WD"},
{"gecko":"order","webkit":"-webkit-order","presto":"","trident":"","status":""},
{"gecko":"-moz-orient","webkit":"","presto":"","trident":"","status":""},
{"gecko":"-moz-osx-font-smoothing","webkit":"","presto":"","trident":"","status":""},
{"gecko":"-moz-outline-radius","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"-moz-outline-radius-bottomleft","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"-moz-outline-radius-bottomright","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"-moz-outline-radius-topleft","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"-moz-outline-radius-topright","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"","webkit":"","presto":"","trident":"-ms-overflow-style","status":"CR"},
{"gecko":"overflow-x","webkit":"overflow-x","presto":"overflow-x","trident":"-ms-overflow-x","status":"WD"},
{"gecko":"overflow-y","webkit":"overflow-y","presto":"overflow-y","trident":"-ms-overflow-y","status":"WD"},
{"gecko":"","webkit":"-webkit-padding-after","presto":"","trident":"","status":"ED"},
{"gecko":"","webkit":"-webkit-padding-before","presto":"","trident":"","status":"ED"},
{"gecko":"-moz-padding-end","webkit":"-webkit-padding-end","presto":"","trident":"","status":"ED"},
{"gecko":"-moz-padding-start","webkit":"-webkit-padding-start","presto":"","trident":"","status":"ED"},
{"gecko":"perspective","webkit":"-webkit-perspective","presto":"","trident":"perspective","status":"WD"},
{"gecko":"perspective-origin","webkit":"-webkit-perspective-origin","presto":"","trident":"perspective-origin","status":"WD"},
{"gecko":"","webkit":"-webkit-perspective-origin-x","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-perspective-origin-y","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-xv-phonemes","trident":"","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-progress-appearance","status":""},
{"gecko":"","webkit":"-webkit-region-break-after","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-region-break-before","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-region-break-inside","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-region-fragment","presto":"","trident":"","status":""},
{"gecko":"-moz-script-level","webkit":"","presto":"","trident":"","status":""},
{"gecko":"-moz-script-min-size","webkit":"","presto":"","trident":"","status":""},
{"gecko":"-moz-script-size-multiplier","webkit":"","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-scroll-chaining","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-scroll-limit","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-scroll-limit-x-max","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-scroll-limit-x-min","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-scroll-limit-y-max","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-scroll-limit-y-min","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-scroll-rails","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-scroll-snap-points-x","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-scroll-snap-points-y","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-scroll-snap-type","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-scroll-snap-x","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-scroll-snap-y","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-scroll-translation","status":""},
{"gecko":"","webkit":"","presto":"scrollbar-arrow-color","trident":"-ms-scrollbar-arrow-color","status":"P"},
{"gecko":"","webkit":"","presto":"scrollbar-base-color","trident":"-ms-scrollbar-base-color","status":"P"},
{"gecko":"","webkit":"","presto":"scrollbar-darkshadow-color","trident":"-ms-scrollbar-darkshadow-color","status":"P"},
{"gecko":"","webkit":"","presto":"scrollbar-face-color","trident":"-ms-scrollbar-face-color","status":"P"},
{"gecko":"","webkit":"","presto":"scrollbar-highlight-color","trident":"-ms-scrollbar-highlight-color","status":"P"},
{"gecko":"","webkit":"","presto":"scrollbar-shadow-color","trident":"-ms-scrollbar-shadow-color","status":"P"},
{"gecko":"","webkit":"","presto":"scrollbar-track-color","trident":"-ms-scrollbar-track-color","status":"P"},
{"gecko":"","webkit":"-webkit-shape-image-threshold","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-shape-inside","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-shape-margin","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-shape-outside","presto":"","trident":"","status":""},
{"gecko":"","webkit":"-webkit-shape-padding","presto":"","trident":"","status":""},
{"gecko":"-moz-stack-sizing","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"","webkit":"-webkit-svg-shadow","presto":"","trident":"","status":""},
{"gecko":"-moz-tab-size","webkit":"","presto":"-o-tab-size","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-o-table-baseline","trident":"","status":""},
{"gecko":"","webkit":"-webkit-tap-highlight-color","presto":"","trident":"","status":"P"},
{"gecko":"-moz-text-align-last","webkit":"","presto":"","trident":"-ms-text-align-last","status":"WD"},
{"gecko":"","webkit":"","presto":"","trident":"-ms-text-autospace","status":"WD"},
{"gecko":"","webkit":"-epub-text-combine","presto":"","trident":"","status":""},
{"gecko":"text-decoration","webkit":"-webkit-text-decoration","presto":"text-decoration","trident":"text-decoration","status":"WD"},
{"gecko":"-moz-text-decoration-color","webkit":"-webkit-text-decoration-color","presto":"","trident":"","status":""},
{"gecko":"-moz-text-decoration-line","webkit":"-webkit-text-decoration-line","presto":"","trident":"","status":""},
{"gecko":"-moz-text-decoration-style","webkit":"-webkit-text-decoration-style","presto":"","trident":"","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-text-justify","status":"WD"},
{"gecko":"","webkit":"","presto":"","trident":"-ms-text-kashida-space","status":"P"},
{"gecko":"text-orientation","webkit":"-epub-text-orientation","presto":"","trident":"","status":""},
{"gecko":"text-overflow","webkit":"text-overflow","presto":"text-overflow","trident":"-ms-text-overflow","status":"WD"},
{"gecko":"-moz-text-size-adjust","webkit":"","presto":"","trident":"","status":""},
{"gecko":"text-transform","webkit":"-epub-text-transform","presto":"text-transform","trident":"text-transform","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-text-underline-position","status":"P"},
{"gecko":"","webkit":"","presto":"","trident":"-ms-touch-action","status":""},
{"gecko":"","webkit":"-webkit-touch-callout","presto":"","trident":"","status":"P"},
{"gecko":"-moz-transform","webkit":"-webkit-transform","presto":"-o-transform","trident":"transform","status":"WD"},
{"gecko":"transform-origin","webkit":"-webkit-transform-origin","presto":"-o-transform-origin","trident":"transform-origin","status":"WD"},
{"gecko":"","webkit":"-webkit-transform-origin-x","presto":"","trident":"","status":"P"},
{"gecko":"","webkit":"-webkit-transform-origin-y","presto":"","trident":"","status":"P"},
{"gecko":"","webkit":"-webkit-transform-origin-z","presto":"","trident":"","status":"P"},
{"gecko":"transform-style","webkit":"-webkit-transform-style","presto":"","trident":"transform-style","status":"WD"},
{"gecko":"transition","webkit":"-webkit-transition","presto":"-o-transition","trident":"transition","status":"WD"},
{"gecko":"transition-delay","webkit":"-webkit-transition-delay","presto":"-o-transition-delay","trident":"transition-delay","status":"WD"},
{"gecko":"transition-duration","webkit":"-webkit-transition-duration","presto":"-o-transition-duration","trident":"transition-duration","status":"WD"},
{"gecko":"transition-property","webkit":"-webkit-transition-property","presto":"-o-transition-property","trident":"transition-property","status":"WD"},
{"gecko":"transition-timing-function","webkit":"-webkit-transition-timing-function","presto":"-o-transition-timing-function","trident":"transition-timing-function","status":"WD"},
{"gecko":"","webkit":"-webkit-user-drag","presto":"","trident":"","status":"P"},
{"gecko":"-moz-user-focus","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"-moz-user-input","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"-moz-user-modify","webkit":"","presto":"","trident":"","status":""},
{"gecko":"-moz-user-select","webkit":"","presto":"","trident":"-ms-user-select","status":""},
{"gecko":"","webkit":"","presto":"-xv-voice-balance","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-xv-voice-duration","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-xv-voice-pitch","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-xv-voice-pitch-range","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-xv-voice-rate","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-xv-voice-stress","trident":"","status":""},
{"gecko":"","webkit":"","presto":"-xv-voice-volume","trident":"","status":""},
{"gecko":"-moz-window-shadow","webkit":"","presto":"","trident":"","status":"P"},
{"gecko":"word-break","webkit":"-epub-word-break","presto":"","trident":"-ms-word-break","status":"WD"},
{"gecko":"word-wrap","webkit":"","presto":"word-wrap","trident":"-ms-word-wrap","status":"WD"},
{"gecko":"","webkit":"-webkit-wrap-flow","presto":"","trident":"-ms-wrap-flow","status":""},
{"gecko":"","webkit":"","presto":"","trident":"-ms-wrap-margin","status":""},
{"gecko":"","webkit":"-webkit-wrap-through","presto":"","trident":"-ms-wrap-through","status":""},
{"gecko":"writing-mode","webkit":"-epub-writing-mode","presto":"writing-mode","trident":"-ms-writing-mode","status":"ED"},
{"gecko":"","webkit":"zoom","presto":"","trident":"-ms-zoom","status":""}]};

var PrefixHelper = {

  mVENDOR_PREFIXES: null,

  kEXPORTS_FOR_GECKO:   true,
  kEXPORTS_FOR_WEBKIT:  true,
  kEXPORTS_FOR_PRESTO:  true,
  kEXPORTS_FOR_TRIDENT: true,

  cleanPrefixes: function()
  {
    this.mVENDOR_PREFIXES = null;
  },

  prefixesForProperty: function(aProperty)
  {
    if (!this.mVENDOR_PREFIXES) {

      this.mVENDOR_PREFIXES = {};
      for (var i = 0; i < kCSS_VENDOR_PREFIXES.properties.length; i++) {
        var p = kCSS_VENDOR_PREFIXES.properties[i];
        if (p.gecko && (p.webkit || p.presto || p.trident)) {
          var o = {};
          if (this.kEXPORTS_FOR_GECKO) o[p.gecko] = true;
          if (this.kEXPORTS_FOR_WEBKIT && p.webkit)  o[p.webkit] = true;
          if (this.kEXPORTS_FOR_PRESTO && p.presto)  o[p.presto] = true;
          if (this.kEXPORTS_FOR_TRIDENT && p.trident) o[p.trident] = true;
          this.mVENDOR_PREFIXES[p.gecko] = [];
          for (var j in o)
            this.mVENDOR_PREFIXES[p.gecko].push(j)
        }
      }
    }
    if (aProperty in this.mVENDOR_PREFIXES)
      return this.mVENDOR_PREFIXES[aProperty].sort();
    return null;
  }
};

function ParseURL(buffer) {
  var result = { };
  result.protocol = "";
  result.user = "";
  result.password = "";
  result.host = "";
  result.port = "";
  result.path = "";
  result.query = "";

  var section = "PROTOCOL";
  var start = 0;
  var wasSlash = false;

  while(start < buffer.length) {
    if(section == "PROTOCOL") {
      if(buffer.charAt(start) == ':') {
        section = "AFTER_PROTOCOL";
        start++;
      } else if(buffer.charAt(start) == '/' && result.protocol.length() == 0) { 
        section = PATH;
      } else {
        result.protocol += buffer.charAt(start++);
      }
    } else if(section == "AFTER_PROTOCOL") {
      if(buffer.charAt(start) == '/') {
    if(!wasSlash) {
          wasSlash = true;
    } else {
          wasSlash = false;
          section = "USER";
    }
        start ++;
      } else {
        throw new ParseException("Protocol shell be separated with 2 slashes");
      }       
    } else if(section == "USER") {
      if(buffer.charAt(start) == '/') {
        result.host = result.user;
        result.user = "";
        section = "PATH";
      } else if(buffer.charAt(start) == '?') {
        result.host = result.user;
        result.user = "";
        section = "QUERY";
        start++;
      } else if(buffer.charAt(start) == ':') {
        section = "PASSWORD";
        start++;
      } else if(buffer.charAt(start) == '@') {
        section = "HOST";
        start++;
      } else {
        result.user += buffer.charAt(start++);
      }
    } else if(section == "PASSWORD") {
      if(buffer.charAt(start) == '/') {
        result.host = result.user;
        result.port = result.password;
        result.user = "";
        result.password = "";
        section = "PATH";
      } else if(buffer.charAt(start) == '?') {
        result.host = result.user;
        result.port = result.password;
        result.user = "";
        result.password = "";
        section = "QUERY";
        start ++;
      } else if(buffer.charAt(start) == '@') {
        section = "HOST";
        start++;
      } else {
        result.password += buffer.charAt(start++);
      }
    } else if(section == "HOST") {
      if(buffer.charAt(start) == '/') {
        section = "PATH";
      } else if(buffer.charAt(start) == ':') {
        section = "PORT";
        start++;
      } else if(buffer.charAt(start) == '?') {
        section = "QUERY";
        start++;
      } else {
        result.host += buffer.charAt(start++);
      }
    } else if(section == "PORT") {
      if(buffer.charAt(start) == '/') {
        section = "PATH";
      } else if(buffer.charAt(start) == '?') {
        section = "QUERY";
        start++;
      } else {
        result.port += buffer.charAt(start++);
      }
    } else if(section == "PATH") {
      if(buffer.charAt(start) == '?') {
    section = "QUERY";
    start ++;
      } else {
    result.path += buffer.charAt(start++);
      }
    } else if(section == "QUERY") {
      result.query += buffer.charAt(start++);
    }
  }

  if(section == "PROTOCOL") {
    result.host = result.protocol;
    result.protocol = "http";
  } else if(section == "AFTER_PROTOCOL") {
    throw new ParseException("Invalid url");
  } else if(section == "USER") {
    result.host = result.user;
    result.user = "";
  } else if(section == "PASSWORD") {
    result.host = result.user;
    result.port = result.password;
    result.user = "";
    result.password = "";
  }

  return result;
}

function ParseException(description) {
    this.description = description;
}

function CountLF(s)
{
  var nCR = s.match( /\n/g );
  return nCR ? nCR.length + 1 : 1;
}

function DisposablePartialParsing(aStringToParse, aMethodName)
{
  var parser = new CSSParser();
  parser._init();
  parser.mPreserveWS       = false;
  parser.mPreserveComments = false;
  parser.mPreservedTokens = [];
  parser.mScanner.init(aStringToParse);

  return parser[aMethodName]();    
}

function FilterLinearGradient(aValue, aEngine)
{
  var d = DisposablePartialParsing(aValue, "parseBackgroundImages");
  if (!d)
    return null;
  var g = d[0];
  if (!g.value)
    return null;

  var str = "";
  var position = ("position" in g.value) ? g.value.position.toLowerCase() : "";
  var angle    = ("angle" in g.value) ? g.value.angle.toLowerCase() : "";

  if ("webkit20110101" == aEngine) {
    var cancelled = false;
    str = "-webkit-gradient(linear, ";
    // normalize angle
    if (angle) {
      var match = angle.match(/^([0-9\-\.\\+]+)([a-z]*)/);
      var angle = parseFloat(match[1]);
      var unit  = match[2];
      switch (unit) {
        case "grad": angle = angle * 90 / 100; break;
        case "rad":  angle = angle * 180 / Math.PI; break;
        default: break;
      }
      while (angle < 0)
        angle += 360;
      while (angle >= 360)
        angle -= 360;
    }
    // get startpoint w/o keywords
    var startpoint = [];
    var endpoint = [];
    if (position != "") {
      if (position == "center")
        position = "center center";
      startpoint = position.split(" ");
      if (angle == "" && angle != 0) {
        // no angle, then we just turn the point 180 degrees around center
        switch (startpoint[0]) {
          case "left":   endpoint.push("right"); break;
          case "center": endpoint.push("center"); break;
          case "right":  endpoint.push("left"); break;
          default: {
              var match = startpoint[0].match(/^([0-9\-\.\\+]+)([a-z]*)/);
              var v     = parseFloat(match[0]);
              var unit  = match[1];
              if (unit == "%") {
                endpoint.push((100-v) + "%");
              }
              else
                cancelled = true;
            }
            break;
        }
        if (!cancelled)
          switch (startpoint[1]) {
            case "top":    endpoint.push("bottom"); break;
            case "center": endpoint.push("center"); break;
            case "bottom": endpoint.push("top"); break;
            default: {
                var match = startpoint[1].match(/^([0-9\-\.\\+]+)([a-z]*)/);
                var v     = parseFloat(match[0]);
                var unit  = match[1];
                if (unit == "%") {
                  endpoint.push((100-v) + "%");
                }
                else
                  cancelled = true;
              }
              break;
          }
      }
      else {
        switch (angle) {
          case 0:    endpoint.push("right"); endpoint.push(startpoint[1]); break;
          case 90:   endpoint.push(startpoint[0]); endpoint.push("top"); break;
          case 180:  endpoint.push("left"); endpoint.push(startpoint[1]); break;
          case 270:  endpoint.push(startpoint[0]); endpoint.push("bottom"); break;
          default:     cancelled = true; break;
        }
      }
    }
    else {
      // no position defined, we accept only vertical and horizontal
      if (angle == "")
        angle = 270;
      switch (angle) {
        case 0:    startpoint= ["left", "center"];   endpoint = ["right", "center"]; break;
        case 90:   startpoint= ["center", "bottom"]; endpoint = ["center", "top"]; break;
        case 180:  startpoint= ["right", "center"];  endpoint = ["left", "center"]; break;
        case 270:  startpoint= ["center", "top"];    endpoint = ["center", "bottom"]; break;
        default:     cancelled = true; break;
      }
    }
  
    if (cancelled)
      return "";
  
    str += startpoint.join(" ") + ", " + endpoint.join(" ");
    if (!g.value.stops[0].position)
      g.value.stops[0].position = "0%";
    if (!g.value.stops[g.value.stops.length-1].position)
      g.value.stops[g.value.stops.length-1].position = "100%";
    var current = 0;
    for (var i = 0; i < g.value.stops.length && !cancelled; i++) {
      var s = g.value.stops[i];
      if (s.position) {
        if (s.position.indexOf("%") == -1) {
          cancelled = true;
          break;
        }
      }
      else {
        var j = i + 1;
        while (j < g.value.stops.length && !g.value.stops[j].position)
          j++;
        var inc = parseFloat(g.value.stops[j].position) - current;
        for (var k = i; k < j; k++) {
          g.value.stops[k].position = (current + inc * (k - i + 1) / (j - i + 1)) + "%";
        }
      }
      current = parseFloat(s.position);
      str += ", color-stop(" + (parseFloat(current) / 100) + ", " + s.color + ")";
    }
  
    if (cancelled)
      return "";
  }
  else {
    str = (g.value.isRepeating ? "repeating-" : "") + "linear-gradient(";
    if (angle || position)
      str += (angle ? angle : position) + ", ";
  
    for (var i = 0; i < g.value.stops.length; i++) {
      var s = g.value.stops[i];
      str += s.color
             + (s.position ? " " + s.position : "")
             + ((i != g.value.stops.length -1) ? ", " : "");
    }
  }
  str += ")";

  switch (aEngine) {
    case "webkit":     str = "-webkit-"  + str; break;
    case "gecko1.9.2": str = "-moz-"  + str; break;
    case "presto":     str = "-o-"  + str; break;
    case "trident":    str = "-ms-"  + str; break;
    default:           break;
  }
  return str;
}

function FilterRadialGradient(aValue, aEngine)
{
  var d = DisposablePartialParsing(aValue, "parseBackgroundImages");
  if (!d)
    return null;
  var g = d[0];
  if (!g.value)
    return null;

  // oh come on, this is now so painful to deal with ; no way I'm going to implement this
  if ("webkit20110101" == aEngine)
    return null;
  
  var str = (g.value.isRepeating ? "repeating-" : "") + "radial-gradient(";
  var shape = ("shape" in g.value) ? g.value.shape : "";
  var extent  = ("extent"  in g.value) ? g.value.extent : "";
  var lengths = "";
  switch (g.value.positions.length) {
    case 1:
      lengths = g.value.positions[0] + " " + g.value.positions[0];
      break;
    case 2:
      lengths = g.value.positions[0] + " " + g.value.positions[1];
      break;
    default:
      break;
  }
  var at = g.value.at;

  str += (at ? at + ", " : "")
         + ((shape || extent || at)
            ? (shape ? shape + " " : "")
              + (extent ? extent + " " : "")
              + (lengths ? lengths + " " : "")
              + ", "
            : "");
  for (var i = 0; i < g.value.stops.length; i++) {
    var s = g.value.stops[i];
    str += s.color
           + (s.position ? " " + s.position : "")
           + ((i != g.value.stops.length -1) ? ", " : "");
  }
  str += ")";

  switch (aEngine) {
    case "webkit":     str = "-webkit-"  + str; break;
    case "gecko1.9.2": str = "-moz-"  + str; break;
    case "presto":     str = "-o-"  + str; break;
    case "trident":    str = "-ms-"  + str; break;
    default:           break;
  }
  return str;
}

var CSS_ESCAPE  = '\\';

var IS_HEX_DIGIT  = 1;
var START_IDENT   = 2;
var IS_IDENT      = 4;
var IS_WHITESPACE = 8;

var W   = IS_WHITESPACE;
var I   = IS_IDENT;
var S   =          START_IDENT;
var SI  = IS_IDENT|START_IDENT;
var XI  = IS_IDENT            |IS_HEX_DIGIT;
var XSI = IS_IDENT|START_IDENT|IS_HEX_DIGIT;

function CSSScanner(aString)
{
  this.init(aString);
}

CSSScanner.prototype = {

  kLexTable: [
  //                                     TAB LF      FF  CR
     0,  0,  0,  0,  0,  0,  0,  0,  0,  W,  W,  0,  W,  W,  0,  0,
  //
     0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  // SPC !   "   #   $   %   &   '   (   )   *   +   ,   -   .   /
     W,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  I,  0,  0,
  // 0   1   2   3   4   5   6   7   8   9   :   ;   <   =   >   ?
     XI, XI, XI, XI, XI, XI, XI, XI, XI, XI, 0,  0,  0,  0,  0,  0,
  // @   A   B   C   D   E   F   G   H   I   J   K   L   M   N   O
     0,  XSI,XSI,XSI,XSI,XSI,XSI,SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // P   Q   R   S   T   U   V   W   X   Y   Z   [   \   ]   ^   _
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, 0,  S,  0,  0,  SI,
  // `   a   b   c   d   e   f   g   h   i   j   k   l   m   n   o
     0,  XSI,XSI,XSI,XSI,XSI,XSI,SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // p   q   r   s   t   u   v   w   x   y   z   {   |   }   ~
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, 0,  0,  0,  0,  0,
  //
     0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  //
     0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  //     ¡   ¢   £   ¤   ¥   ¦   §   ¨   ©   ª   «   ¬   ­   ®   ¯
     0,  SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // °   ±   ²   ³   ´   µ   ¶   ·   ¸   ¹   º   »   ¼   ½   ¾   ¿
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // À   Á   Â   Ã   Ä   Å   Æ   Ç   È   É   Ê   Ë   Ì   Í   Î   Ï
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // Ð   Ñ   Ò   Ó   Ô   Õ   Ö   ×   Ø   Ù   Ú   Û   Ü   Ý   Þ   ß
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // à   á   â   ã   ä   å   æ   ç   è   é   ê   ë   ì   í   î   ï
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // ð   ñ   ò   ó   ô   õ   ö   ÷   ø   ù   ú   û   ü   ý   þ   ÿ
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI
  ],

  kHexValues: {
    "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
    "a": 10, "b": 11, "c": 12, "d": 13, "e": 14, "f": 15
  },

  mString : "",
  mPos : 0,
  mPreservedPos : [],

  init: function(aString) {
    this.mString = aString;
    this.mPos = 0;
    this.mPreservedPos = [];
  },

  getCurrentPos: function() {
    return this.mPos;
  },

  getAlreadyScanned: function()
  {
    return this.mString.substr(0, this.mPos);
  },

  preserveState: function() {
    this.mPreservedPos.push(this.mPos);
  },

  restoreState: function() {
    if (this.mPreservedPos.length) {
      this.mPos = this.mPreservedPos.pop();
    }
  },

  forgetState: function() {
    if (this.mPreservedPos.length) {
      this.mPreservedPos.pop();
    }
  },

  read: function() {
    if (this.mPos < this.mString.length)
      return this.mString.charAt(this.mPos++);
    return -1;
  },

  peek: function() {
    if (this.mPos < this.mString.length)
      return this.mString.charAt(this.mPos);
    return -1;
  },

  isHexDigit: function(c) {
    var code = c.charCodeAt(0);
    return (code < 256 && (this.kLexTable[code] & IS_HEX_DIGIT) != 0);
  },

  isIdentStart: function(c) {
    var code = c.charCodeAt(0);
    return (code >= 256 || (this.kLexTable[code] & START_IDENT) != 0);
  },

  startsWithIdent: function(aFirstChar, aSecondChar) {
    var code = aFirstChar.charCodeAt(0);
    return this.isIdentStart(aFirstChar) ||
           (aFirstChar == "-" && this.isIdentStart(aSecondChar));
  },

  isIdent: function(c) {
    var code = c.charCodeAt(0);
    return (code >= 256 || (this.kLexTable[code] & IS_IDENT) != 0);
  },

  pushback: function() {
    this.mPos--;
  },

  nextHexValue: function() {
    var c = this.read();
    if (c == -1 || !this.isHexDigit(c))
      return new jscsspToken(jscsspToken.NULL_TYPE, null);
    var s = c;
    c = this.read();
    while (c != -1 && this.isHexDigit(c)) {
      s += c;
      c = this.read();
    }
    if (c != -1)
      this.pushback();
    return new jscsspToken(jscsspToken.HEX_TYPE, s);
  },

  gatherEscape: function() {
    var c = this.peek();
    if (c == -1)
      return "";
    if (this.isHexDigit(c)) {
      var code = 0;
      for (var i = 0; i < 6; i++) {
        c = this.read();
        if (this.isHexDigit(c))
          code = code * 16 + this.kHexValues[c.toLowerCase()];
        else if (!this.isHexDigit(c) && !this.isWhiteSpace(c)) {
          this.pushback();
          break;
        }
        else
          break;
      }
      if (i == 6) {
        c = this.peek();
        if (this.isWhiteSpace(c))
          this.read();
      }
      return String.fromCharCode(code);
    }
    c = this.read();
    if (c != "\n")
      return c;
    return "";
  },

  gatherIdent: function(c) {
    var s = "";
    if (c == CSS_ESCAPE)
      s += this.gatherEscape();
    else
      s += c;
    c = this.read();
    while (c != -1
           && (this.isIdent(c) || c == CSS_ESCAPE)) {
      if (c == CSS_ESCAPE)
        s += this.gatherEscape();
      else
        s += c;
      c = this.read();
    }
    if (c != -1)
      this.pushback();
    return s;
  },

  parseIdent: function(c) {
    var value = this.gatherIdent(c);
    var nextChar = this.peek();
    if (nextChar == "(") {
      value += this.read();
      return new jscsspToken(jscsspToken.FUNCTION_TYPE, value);
    }
    return new jscsspToken(jscsspToken.IDENT_TYPE, value);
  },

  isDigit: function(c) {
    return (c >= '0') && (c <= '9');
  },

  parseComment: function(c) {
    var s = c;
    while ((c = this.read()) != -1) {
      s += c;
      if (c == "*") {
        c = this.read();
        if (c == -1)
          break;
        if (c == "/") {
          s += c;
          break;
        }
        this.pushback();
      }
    }
    return new jscsspToken(jscsspToken.COMMENT_TYPE, s);
  },

  parseNumber: function(c) {
    var s = c;
    var foundDot = false;
    while ((c = this.read()) != -1) {
      if (c == ".") {
        if (foundDot)
          break;
        else {
          s += c;
          foundDot = true;
        }
      } else if (this.isDigit(c))
        s += c;
      else
        break;
    }

    if (c != -1 && this.startsWithIdent(c, this.peek())) { // DIMENSION
      var unit = this.gatherIdent(c);
      s += unit;
      return new jscsspToken(jscsspToken.DIMENSION_TYPE, s, unit);
    }
    else if (c == "%") {
      s += "%";
      return new jscsspToken(jscsspToken.PERCENTAGE_TYPE, s);
    }
    else if (c != -1)
      this.pushback();
    return new jscsspToken(jscsspToken.NUMBER_TYPE, s);
  },

  parseString: function(aStop) {
    var s = aStop;
    var previousChar = aStop;
    var c;
    while ((c = this.read()) != -1) {
      if (c == aStop && previousChar != CSS_ESCAPE) {
        s += c;
        break;
      }
      else if (c == CSS_ESCAPE) {
        c = this.peek();
        if (c == -1)
          break;
        else if (c == "\n" || c == "\r" || c == "\f") {
          d = c;
          c = this.read();
          // special for Opera that preserves \r\n...
          if (d == "\r") {
            c = this.peek();
            if (c == "\n")
              c = this.read();
          }
        }
        else {
          s += this.gatherEscape();
          c = this.peek();
        }
      }
      else if (c == "\n" || c == "\r" || c == "\f") {
        break;
      }
      else
        s += c;

      previousChar = c;
    }
    return new jscsspToken(jscsspToken.STRING_TYPE, s);
  },

  isWhiteSpace: function(c) {
    var code = c.charCodeAt(0);
    return code < 256 && (this.kLexTable[code] & IS_WHITESPACE) != 0;
  },

  eatWhiteSpace: function(c) {
    var s = c;
    while ((c = this.read()) != -1) {
      if (!this.isWhiteSpace(c))
        break;
      s += c;
    }
    if (c != -1)
      this.pushback();
    return s;
  },

  parseAtKeyword: function(c) {
    return new jscsspToken(jscsspToken.ATRULE_TYPE, this.gatherIdent(c));
  },

  nextToken: function() {
    var c = this.read();
    if (c == -1)
      return new jscsspToken(jscsspToken.NULL_TYPE, null);

    if (this.startsWithIdent(c, this.peek()))
      return this.parseIdent(c);

    if (c == '@') {
      var nextChar = this.read();
      if (nextChar != -1) {
        var followingChar = this.peek();
        this.pushback();
        if (this.startsWithIdent(nextChar, followingChar))
          return this.parseAtKeyword(c);
      }
    }

    if (c == "." || c == "+" || c == "-") {
      var nextChar = this.peek();
      if (this.isDigit(nextChar))
        return this.parseNumber(c);
      else if (nextChar == "." && c != ".") {
        firstChar = this.read();
        var secondChar = this.peek();
        this.pushback();
        if (this.isDigit(secondChar))
          return this.parseNumber(c);
      }
    }
    if (this.isDigit(c)) {
      return this.parseNumber(c);
    }

    if (c == "'" || c == '"')
      return this.parseString(c);

    if (this.isWhiteSpace(c)) {
      var s = this.eatWhiteSpace(c);
      
      return new jscsspToken(jscsspToken.WHITESPACE_TYPE, s);
    }

    if (c == "|" || c == "~" || c == "^" || c == "$" || c == "*") {
      var nextChar = this.read();
      if (nextChar == "=") {
        switch (c) {
          case "~" :
            return new jscsspToken(jscsspToken.INCLUDES_TYPE, "~=");
          case "|" :
            return new jscsspToken(jscsspToken.DASHMATCH_TYPE, "|=");
          case "^" :
            return new jscsspToken(jscsspToken.BEGINSMATCH_TYPE, "^=");
          case "$" :
            return new jscsspToken(jscsspToken.ENDSMATCH_TYPE, "$=");
          case "*" :
            return new jscsspToken(jscsspToken.CONTAINSMATCH_TYPE, "*=");
          default :
            break;
        }
      } else if (nextChar != -1)
        this.pushback();
    }

    if (c == "/" && this.peek() == "*")
      return this.parseComment(c);

    return new jscsspToken(jscsspToken.SYMBOL_TYPE, c);
  }
};

CSSParser.prototype.parseBackgroundImages = function()
{
  var backgrounds = [];
  var token = this.getToken(true, true);
  while (token.isNotNull()) {
    if (token.isFunction("url(")) {
      token = this.getToken(true, true);
      var urlContent = this.parseURL(token);
      backgrounds.push( { type: "image", value: "url(" + urlContent });
      token = this.getToken(true, true);
    }
    else if (token.isFunction("linear-gradient(")
             || token.isFunction("radial-gradient(")
             || token.isFunction("repeating-linear-gradient(")
             || token.isFunction("repeating-radial-gradient(")) {
      this.ungetToken();
      var gradient = this.parseGradient();
      if (gradient) {
        backgrounds.push({
                         type: gradient.isRadial ? "radial-gradient" : "linear-gradient",
                         value: gradient
                         });
        token = this.getToken(true, true);
      }
      else
        return null;
    }
    else if (token.isIdent("none")
             || token.isIdent("inherit")
             || token.isIdent("initial")) {
      backgrounds.push( { type: token.value });
      token = this.getToken(true, true);
    }
    else
      return null;
    
    if (token.isSymbol(",")) {
      token = this.getToken(true, true);
      if (!token.isNotNull())
        return null;
    }
  }
  return backgrounds;
};

CSSParser.prototype.parseBackgroundShorthand = function(token, aDecl, aAcceptPriority)
{
  var kHPos = {
    "left" : true,
    "right" : true
  };
  var kVPos = {
    "top" : true,
    "bottom" : true
  };
  var kPos = {
    "left" : true,
    "right" : true,
    "top" : true,
    "bottom" : true,
    "center" : true
  };
  
  var bgColor = null;
  var bgRepeat = null;
  var bgAttachment = null;
  var bgImage = null;
  var bgPosition = null;
  
  while (true) {
    
    if (!token.isNotNull())
      break;
    
    if (token.isSymbol(";")
        || (aAcceptPriority && token.isSymbol("!"))
        || token.isSymbol("}")) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    }
    
    else if (!bgColor
             && !bgRepeat
             && !bgAttachment
             && !bgImage
             && !bgPosition
             && token.isIdent(this.kINHERIT)) {
      bgColor = this.kINHERIT;
      bgRepeat = this.kINHERIT;
      bgAttachment = this.kINHERIT;
      bgImage = this.kINHERIT;
      bgPosition = this.kINHERIT;
    }
    
    else {
      if (!bgAttachment
          && (token.isIdent("scroll") || token.isIdent("fixed"))) {
        bgAttachment = token.value;
      }
      
      else if (!bgPosition
               && ((token.isIdent() && token.value in kPos)
                   || token.isDimension()
                   || token.isNumber("0")
                   || token.isPercentage())) {
                 bgPosition = token.value;
                 token = this.getToken(true, true);
                 if (token.isDimension()
                     || token.isNumber("0")
                     || token.isPercentage()) {
                   bgPosition += " " + token.value;
                 } else if (token.isIdent() && token.value in kPos) {
                   if ((bgPosition in kHPos && token.value in kHPos)
                       || (bgPosition in kVPos && token.value in kVPos))
                     return "";
                   bgPosition += " " + token.value;
                 } else {
                   this.ungetToken();
                   bgPosition += " center";
                 }
               }
      
      else if (!bgRepeat
               && (token.isIdent("repeat")
                   || token.isIdent("repeat-x")
                   || token.isIdent("repeat-y")
                   || token.isIdent("no-repeat"))) {
                 bgRepeat = token.value;
               }
      
      else if (!bgImage
               && (token.isFunction("url(") || token.isIdent("none"))) {
        bgImage = token.value;
        if (token.isFunction("url(")) {
          token = this.getToken(true, true);
          var url = this.parseURL(token); // TODO
          if (url)
            bgImage += url;
          else
            return "";
        }
      }
      
      else if (!bgImage
               && (token.isFunction("linear-gradient(")
                   || token.isFunction("radial-gradient(")
                   || token.isFunction("repeating-linear-gradient(") || token.isFunction("repeating-radial-gradient("))) {
                 this.ungetToken();
                 var gradient = this.parseGradient();
                 if (gradient)
                   bgImage = this.serializeGradient(gradient);
                 else
                   return "";
               }
      
      else {
        var color = this.parseColor(token);
        if (!bgColor && color)
          bgColor = color;
        else
          return "";
      }
      
    }
    
    token = this.getToken(true, true);
  }
  
  // create the declarations
  this.forgetState();
  bgColor = bgColor ? bgColor : "transparent";
  bgImage = bgImage ? bgImage : "none";
  bgRepeat = bgRepeat ? bgRepeat : "repeat";
  bgAttachment = bgAttachment ? bgAttachment : "scroll";
  bgPosition = bgPosition ? bgPosition : "top left";
  
  aDecl.push(this._createJscsspDeclarationFromValue("background-color", bgColor));
  aDecl.push(this._createJscsspDeclarationFromValue("background-image", bgImage));
  aDecl.push(this._createJscsspDeclarationFromValue("background-repeat", bgRepeat));
  aDecl.push(this._createJscsspDeclarationFromValue("background-attachment", bgAttachment));
  aDecl.push(this._createJscsspDeclarationFromValue("background-position", bgPosition));
  
  return bgColor + " " + bgImage + " " + bgRepeat + " " + bgAttachment + " " + bgPosition;
};
CSSParser.prototype.parseBorderColorShorthand = function(token, aDecl, aAcceptPriority)
{
  var top = null;
  var bottom = null;
  var left = null;
  var right = null;
  
  var values = [];
  while (true) {
    
    if (!token.isNotNull())
      break;
    
    if (token.isSymbol(";")
        || (aAcceptPriority && token.isSymbol("!"))
        || token.isSymbol("}")) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    }
    
    else if (!values.length && token.isIdent(this.kINHERIT)) {
      values.push(token.value);
      token = this.getToken(true, true);
      break;
    }
    
    else {
      var color = this.parseColor(token);
      if (color)
        values.push(color);
      else
        return "";
    }
    
    token = this.getToken(true, true);
  }
  
  var count = values.length;
  switch (count) {
    case 1:
      top = values[0];
      bottom = top;
      left = top;
      right = top;
      break;
    case 2:
      top = values[0];
      bottom = top;
      left = values[1];
      right = left;
      break;
    case 3:
      top = values[0];
      left = values[1];
      right = left;
      bottom = values[2];
      break;
    case 4:
      top = values[0];
      right = values[1];
      bottom = values[2];
      left = values[3];
      break;
    default:
      return "";
  }
  this.forgetState();
  aDecl.push(this._createJscsspDeclarationFromValue("border-top-color", top));
  aDecl.push(this._createJscsspDeclarationFromValue("border-right-color", right));
  aDecl.push(this._createJscsspDeclarationFromValue("border-bottom-color", bottom));
  aDecl.push(this._createJscsspDeclarationFromValue("border-left-color", left));
  return top + " " + right + " " + bottom + " " + left;
};

CSSParser.prototype.parseBorderEdgeOrOutlineShorthand = function(token, aDecl, aAcceptPriority, aProperty)
{
  var bWidth = null;
  var bStyle = null;
  var bColor = null;
  
  while (true) {
    if (!token.isNotNull())
      break;
    
    if (token.isSymbol(";")
        || (aAcceptPriority && token.isSymbol("!"))
        || token.isSymbol("}")) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    }
    
    else if (!bWidth
             && !bStyle
             && !bColor
             && token.isIdent(this.kINHERIT)) {
      bWidth = this.kINHERIT;
      bStyle = this.kINHERIT;
      bColor = this.kINHERIT;
    }
    
    else if (!bWidth &&
             (token.isDimension()
              || (token.isIdent() && token.value in this.kBORDER_WIDTH_NAMES)
              || token.isNumber("0"))) {
               bWidth = token.value;
             }
    
    else if (!bStyle &&
             (token.isIdent() && token.value in this.kBORDER_STYLE_NAMES)) {
      bStyle = token.value;
    }
    
    else {
      var color = (aProperty == "outline" && token.isIdent("invert"))
      ? "invert" : this.parseColor(token);
      if (!bColor && color)
        bColor = color;
      else
        return "";
    }
    token = this.getToken(true, true);
  }
  
  // create the declarations
  this.forgetState();
  bWidth = bWidth ? bWidth : "medium";
  bStyle = bStyle ? bStyle : "none";
  bColor = bColor ? bColor : "-moz-initial";
  
  function addPropertyToDecl(aSelf, aDecl, property, w, s, c) {
    aDecl.push(aSelf._createJscsspDeclarationFromValue(property + "-width", w));
    aDecl.push(aSelf._createJscsspDeclarationFromValue(property + "-style", s));
    aDecl.push(aSelf._createJscsspDeclarationFromValue(property + "-color", c));
  }
  
  if (aProperty == "border") {
    addPropertyToDecl(this, aDecl, "border-top", bWidth, bStyle, bColor);
    addPropertyToDecl(this, aDecl, "border-right", bWidth, bStyle, bColor);
    addPropertyToDecl(this, aDecl, "border-bottom", bWidth, bStyle, bColor);
    addPropertyToDecl(this, aDecl, "border-left", bWidth, bStyle, bColor);
  }
  else
    addPropertyToDecl(this, aDecl, aProperty, bWidth, bStyle, bColor);
  return bWidth + " " + bStyle + " " + bColor;
};

CSSParser.prototype.parseBorderImage = function()
{
  var borderImage = {url: "", offsets: [], widths: [], sizes: []};
  var token = this.getToken(true, true);
  if (token.isFunction("url(")) {
    token = this.getToken(true, true);
    var urlContent = this.parseURL(token);
    if (urlContent) {
      borderImage.url = urlContent.substr(0, urlContent.length - 1).trim();
      if ((borderImage.url[0] == '"' && borderImage.url[borderImage.url.length - 1] == '"')
          || (borderImage.url[0] == "'" && borderImage.url[borderImage.url.length - 1] == "'"))
        borderImage.url = borderImage.url.substr(1, borderImage.url.length - 2);
    }
    else
      return null;
  }
  else
    return null; 
  
  token = this.getToken(true, true);
  if (token.isNumber()
      || token.isPercentage())
    borderImage.offsets.push(token.value);
  else
    return null;
  var i;
  for (i= 0; i < 3; i++) {
    token = this.getToken(true, true);
    if (token.isNumber()
        || token.isPercentage())
      borderImage.offsets.push(token.value);
    else
      break;
  }
  if (i == 3)
    token = this.getToken(true, true);
  
  if (token.isSymbol("/")) {
    token = this.getToken(true, true);
    if (token.isDimension()
        || token.isNumber("0")
        || (token.isIdent() && token.value in this.kBORDER_WIDTH_NAMES))
      borderImage.widths.push(token.value);
    else
      return null;
    
    for (var i = 0; i < 3; i++) {
      token = this.getToken(true, true);
      if (token.isDimension()
          || token.isNumber("0")
          || (token.isIdent() && token.value in this.kBORDER_WIDTH_NAMES))
        borderImage.widths.push(token.value);
      else
        break;
    }
    if (i == 3)
      token = this.getToken(true, true);
  }
  
  for (var i = 0; i < 2; i++) {
    if (token.isIdent("stretch")
        || token.isIdent("repeat")
        || token.isIdent("round"))
      borderImage.sizes.push(token.value);
    else if (!token.isNotNull())
      return borderImage;
    else
      return null;
    token = this.getToken(true, true);
  }
  if (!token.isNotNull())
    return borderImage;
  
  return null;
};

CSSParser.prototype.parseBorderStyleShorthand = function(token, aDecl, aAcceptPriority)
{
  var top = null;
  var bottom = null;
  var left = null;
  var right = null;
  
  var values = [];
  while (true) {
    
    if (!token.isNotNull())
      break;
    
    if (token.isSymbol(";")
        || (aAcceptPriority && token.isSymbol("!"))
        || token.isSymbol("}")) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    }
    
    else if (!values.length && token.isIdent(this.kINHERIT)) {
      values.push(token.value);
    }
    
    else if (token.isIdent() && token.value in this.kBORDER_STYLE_NAMES) {
      values.push(token.value);
    }
    else
      return "";
    
    token = this.getToken(true, true);
  }
  
  var count = values.length;
  switch (count) {
    case 1:
      top = values[0];
      bottom = top;
      left = top;
      right = top;
      break;
    case 2:
      top = values[0];
      bottom = top;
      left = values[1];
      right = left;
      break;
    case 3:
      top = values[0];
      left = values[1];
      right = left;
      bottom = values[2];
      break;
    case 4:
      top = values[0];
      right = values[1];
      bottom = values[2];
      left = values[3];
      break;
    default:
      return "";
  }
  this.forgetState();
  aDecl.push(this._createJscsspDeclarationFromValue("border-top-style", top));
  aDecl.push(this._createJscsspDeclarationFromValue("border-right-style", right));
  aDecl.push(this._createJscsspDeclarationFromValue("border-bottom-style", bottom));
  aDecl.push(this._createJscsspDeclarationFromValue("border-left-style", left));
  return top + " " + right + " " + bottom + " " + left;
};

CSSParser.prototype.parseBorderWidthShorthand = function(token, aDecl, aAcceptPriority)
{
  var top = null;
  var bottom = null;
  var left = null;
  var right = null;
  
  var values = [];
  while (true) {
    
    if (!token.isNotNull())
      break;
    
    if (token.isSymbol(";")
        || (aAcceptPriority && token.isSymbol("!"))
        || token.isSymbol("}")) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    }
    
    else if (!values.length && token.isIdent(this.kINHERIT)) {
      values.push(token.value);
    }
    
    else if (token.isDimension()
             || token.isNumber("0")
             || (token.isIdent() && token.value in this.kBORDER_WIDTH_NAMES)) {
      values.push(token.value);
    }
    else
      return "";
    
    token = this.getToken(true, true);
  }
  
  var count = values.length;
  switch (count) {
    case 1:
      top = values[0];
      bottom = top;
      left = top;
      right = top;
      break;
    case 2:
      top = values[0];
      bottom = top;
      left = values[1];
      right = left;
      break;
    case 3:
      top = values[0];
      left = values[1];
      right = left;
      bottom = values[2];
      break;
    case 4:
      top = values[0];
      right = values[1];
      bottom = values[2];
      left = values[3];
      break;
    default:
      return "";
  }
  this.forgetState();
  aDecl.push(this._createJscsspDeclarationFromValue("border-top-width", top));
  aDecl.push(this._createJscsspDeclarationFromValue("border-right-width", right));
  aDecl.push(this._createJscsspDeclarationFromValue("border-bottom-width", bottom));
  aDecl.push(this._createJscsspDeclarationFromValue("border-left-width", left));
  return top + " " + right + " " + bottom + " " + left;
};

CSSParser.prototype.parseBoxShadows = function()
{
  var shadows = [];
  var token = this.getToken(true, true);
  var color = "", blurRadius = "0px", offsetX = "0px", offsetY = "0px", spreadRadius = "0px";
  var inset = false;
  while (token.isNotNull()) {
    if (token.isIdent("none")) {
      shadows.push( { none: true } );
      token = this.getToken(true, true);
    }
    else {
      if (token.isIdent('inset')) {
        inset = true;
        token = this.getToken(true, true);
      }
      
      if (token.isPercentage() ||
          token.isDimensionOfUnit("cm") ||
          token.isDimensionOfUnit("mm") ||
          token.isDimensionOfUnit("in") ||
          token.isDimensionOfUnit("pc") ||
          token.isDimensionOfUnit("px") ||
          token.isDimensionOfUnit("em") ||
          token.isDimensionOfUnit("ex") ||
          token.isDimensionOfUnit("pt")) {
        var offsetX = token.value;
        token = this.getToken(true, true);
      }
      else
        return [];
      
      if (!inset && token.isIdent('inset')) {
        inset = true;
        token = this.getToken(true, true);
      }
      
      if (token.isPercentage() ||
          token.isDimensionOfUnit("cm") ||
          token.isDimensionOfUnit("mm") ||
          token.isDimensionOfUnit("in") ||
          token.isDimensionOfUnit("pc") ||
          token.isDimensionOfUnit("px") ||
          token.isDimensionOfUnit("em") ||
          token.isDimensionOfUnit("ex") ||
          token.isDimensionOfUnit("pt")) {
        var offsetY = token.value;
        token = this.getToken(true, true);
      }
      else
        return [];
      
      if (!inset && token.isIdent('inset')) {
        inset = true;
        token = this.getToken(true, true);
      }
      
      if (token.isPercentage() ||
          token.isDimensionOfUnit("cm") ||
          token.isDimensionOfUnit("mm") ||
          token.isDimensionOfUnit("in") ||
          token.isDimensionOfUnit("pc") ||
          token.isDimensionOfUnit("px") ||
          token.isDimensionOfUnit("em") ||
          token.isDimensionOfUnit("ex") ||
          token.isDimensionOfUnit("pt")) {
        var blurRadius = token.value;
        token = this.getToken(true, true);
      }
      
      if (!inset && token.isIdent('inset')) {
        inset = true;
        token = this.getToken(true, true);
      }
      
      if (token.isPercentage() ||
          token.isDimensionOfUnit("cm") ||
          token.isDimensionOfUnit("mm") ||
          token.isDimensionOfUnit("in") ||
          token.isDimensionOfUnit("pc") ||
          token.isDimensionOfUnit("px") ||
          token.isDimensionOfUnit("em") ||
          token.isDimensionOfUnit("ex") ||
          token.isDimensionOfUnit("pt")) {
        var spreadRadius = token.value;
        token = this.getToken(true, true);
      }
      
      if (!inset && token.isIdent('inset')) {
        inset = true;
        token = this.getToken(true, true);
      }
      
      if (token.isFunction("rgb(") ||
          token.isFunction("rgba(") ||
          token.isFunction("hsl(") ||
          token.isFunction("hsla(") ||
          token.isSymbol("#") ||
          token.isIdent()) {
        var color = this.parseColor(token);
        token = this.getToken(true, true);
      }
      
      if (!inset && token.isIdent('inset')) {
        inset = true;
        token = this.getToken(true, true);
      }
      
      shadows.push( { none: false,
                   color: color,
                   offsetX: offsetX, offsetY: offsetY,
                   blurRadius: blurRadius,
                   spreadRadius: spreadRadius,
                   inset: inset
                   } );
      
      if (token.isSymbol(",")) {
        inset = false;
        color = "";
        blurRadius = "0px";
        spreadRadius = "0px"
        offsetX = "0px";
        offsetY = "0px"; 
        token = this.getToken(true, true);
      }
      else if (!token.isNotNull())
        return shadows;
      else
        return [];
    }
  }
  return shadows;
};

CSSParser.prototype.parseCharsetRule = function(aSheet) {
  var token = this.getToken(false, false);
  if (token.isAtRule("@charset") && token.value == "@charset") { // lowercase check
    var s = token.value;
    token = this.getToken(false, false);
    s += token.value;
    if (token.isWhiteSpace(" ")) {
      token = this.getToken(false, false);
      s += token.value;
      if (token.isString()) {
        var encoding = token.value;
        token = this.getToken(false, false);
        s += token.value;
        if (token.isSymbol(";")) {
          var rule = new jscsspCharsetRule();
          rule.encoding = encoding;
          rule.parsedCssText = s;
          rule.parentStyleSheet = aSheet;
          aSheet.cssRules.push(rule);
          return true;
        }
        else
          this.reportError(kCHARSET_RULE_MISSING_SEMICOLON);
      }
      else
        this.reportError(kCHARSET_RULE_CHARSET_IS_STRING);
    }
    else
      this.reportError(kCHARSET_RULE_MISSING_WS);
  }
  
  this.addUnknownAtRule(aSheet, s);
  return false;
};

CSSParser.prototype.parseColor = function(token)
{
  var color = "";
  if (token.isFunction("rgb(")
      || token.isFunction("rgba(")) {
    color = token.value;
    var isRgba = token.isFunction("rgba(")
    token = this.getToken(true, true);
    if (!token.isNumber() && !token.isPercentage())
      return "";
    color += token.value;
    token = this.getToken(true, true);
    if (!token.isSymbol(","))
      return "";
    color += ", ";
    
    token = this.getToken(true, true);
    if (!token.isNumber() && !token.isPercentage())
      return "";
    color += token.value;
    token = this.getToken(true, true);
    if (!token.isSymbol(","))
      return "";
    color += ", ";
    
    token = this.getToken(true, true);
    if (!token.isNumber() && !token.isPercentage())
      return "";
    color += token.value;
    
    if (isRgba) {
      token = this.getToken(true, true);
      if (!token.isSymbol(","))
        return "";
      color += ", ";
      
      token = this.getToken(true, true);
      if (!token.isNumber())
        return "";
      color += token.value;
    }
    
    token = this.getToken(true, true);
    if (!token.isSymbol(")"))
      return "";
    color += token.value;
  }
  
  else if (token.isFunction("hsl(")
           || token.isFunction("hsla(")) {
    color = token.value;
    var isHsla = token.isFunction("hsla(")
    token = this.getToken(true, true);
    if (!token.isNumber())
      return "";
    color += token.value;
    token = this.getToken(true, true);
    if (!token.isSymbol(","))
      return "";
    color += ", ";
    
    token = this.getToken(true, true);
    if (!token.isPercentage())
      return "";
    color += token.value;
    token = this.getToken(true, true);
    if (!token.isSymbol(","))
      return "";
    color += ", ";
    
    token = this.getToken(true, true);
    if (!token.isPercentage())
      return "";
    color += token.value;
    
    if (isHsla) {
      token = this.getToken(true, true);
      if (!token.isSymbol(","))
        return "";
      color += ", ";
      
      token = this.getToken(true, true);
      if (!token.isNumber())
        return "";
      color += token.value;
    }
    
    token = this.getToken(true, true);
    if (!token.isSymbol(")"))
      return "";
    color += token.value;
  }
  
  else if (token.isIdent()
           && (token.value in this.kCOLOR_NAMES))
    color = token.value;
  
  else if (token.isSymbol("#")) {
    token = this.getHexValue();
    if (!token.isHex())
      return "";
    var length = token.value.length;
    if (length != 3 && length != 6)
      return "";
    if (token.value.match( /[a-fA-F0-9]/g ).length != length)
      return "";
    color = "#" + token.value;
  }
  return color;
};

CSSParser.prototype.kINHERIT = "inherit",

CSSParser.prototype.kBORDER_WIDTH_NAMES = {
  "thin": true,
  "medium": true,
  "thick": true
};

CSSParser.prototype.kBORDER_STYLE_NAMES = {
  "none": true,
  "hidden": true,
  "dotted": true,
  "dashed": true,
  "solid": true,
  "double": true,
  "groove": true,
  "ridge": true,
  "inset": true,
  "outset": true
};

CSSParser.prototype.kCOLOR_NAMES = {
  "transparent": true,
  
  "black": true,
  "silver": true,
  "gray": true,
  "white": true,
  "maroon": true,
  "red": true,
  "purple": true,
  "fuchsia": true,
  "green": true,
  "lime": true,
  "olive": true,
  "yellow": true,
  "navy": true,
  "blue": true,
  "teal": true,
  "aqua": true,
  
  "aliceblue": true,
  "antiquewhite": true,
  "aquamarine": true,
  "azure": true,
  "beige": true,
  "bisque": true,
  "blanchedalmond": true,
  "blueviolet": true,
  "brown": true,
  "burlywood": true,
  "cadetblue": true,
  "chartreuse": true,
  "chocolate": true,
  "coral": true,
  "cornflowerblue": true,
  "cornsilk": true,
  "crimson": true,
  "cyan": true,
  "darkblue": true,
  "darkcyan": true,
  "darkgoldenrod": true,
  "darkgray": true,
  "darkgreen": true,
  "darkgrey": true,
  "darkkhaki": true,
  "darkmagenta": true,
  "darkolivegreen": true,
  "darkorange": true,
  "darkorchid": true,
  "darkred": true,
  "darksalmon": true,
  "darkseagreen": true,
  "darkslateblue": true,
  "darkslategray": true,
  "darkslategrey": true,
  "darkturquoise": true,
  "darkviolet": true,
  "deeppink": true,
  "deepskyblue": true,
  "dimgray": true,
  "dimgrey": true,
  "dodgerblue": true,
  "firebrick": true,
  "floralwhite": true,
  "forestgreen": true,
  "gainsboro": true,
  "ghostwhite": true,
  "gold": true,
  "goldenrod": true,
  "greenyellow": true,
  "grey": true,
  "honeydew": true,
  "hotpink": true,
  "indianred": true,
  "indigo": true,
  "ivory": true,
  "khaki": true,
  "lavender": true,
  "lavenderblush": true,
  "lawngreen": true,
  "lemonchiffon": true,
  "lightblue": true,
  "lightcoral": true,
  "lightcyan": true,
  "lightgoldenrodyellow": true,
  "lightgray": true,
  "lightgreen": true,
  "lightgrey": true,
  "lightpink": true,
  "lightsalmon": true,
  "lightseagreen": true,
  "lightskyblue": true,
  "lightslategray": true,
  "lightslategrey": true,
  "lightsteelblue": true,
  "lightyellow": true,
  "limegreen": true,
  "linen": true,
  "magenta": true,
  "mediumaquamarine": true,
  "mediumblue": true,
  "mediumorchid": true,
  "mediumpurple": true,
  "mediumseagreen": true,
  "mediumslateblue": true,
  "mediumspringgreen": true,
  "mediumturquoise": true,
  "mediumvioletred": true,
  "midnightblue": true,
  "mintcream": true,
  "mistyrose": true,
  "moccasin": true,
  "navajowhite": true,
  "oldlace": true,
  "olivedrab": true,
  "orange": true,
  "orangered": true,
  "orchid": true,
  "palegoldenrod": true,
  "palegreen": true,
  "paleturquoise": true,
  "palevioletred": true,
  "papayawhip": true,
  "peachpuff": true,
  "peru": true,
  "pink": true,
  "plum": true,
  "powderblue": true,
  "rosybrown": true,
  "royalblue": true,
  "saddlebrown": true,
  "salmon": true,
  "sandybrown": true,
  "seagreen": true,
  "seashell": true,
  "sienna": true,
  "skyblue": true,
  "slateblue": true,
  "slategray": true,
  "slategrey": true,
  "snow": true,
  "springgreen": true,
  "steelblue": true,
  "tan": true,
  "thistle": true,
  "tomato": true,
  "turquoise": true,
  "violet": true,
  "wheat": true,
  "whitesmoke": true,
  "yellowgreen": true,
  
  "activeborder": true,
  "activecaption": true,
  "appworkspace": true,
  "background": true,
  "buttonface": true,
  "buttonhighlight": true,
  "buttonshadow": true,
  "buttontext": true,
  "captiontext": true,
  "graytext": true,
  "highlight": true,
  "highlighttext": true,
  "inactiveborder": true,
  "inactivecaption": true,
  "inactivecaptiontext": true,
  "infobackground": true,
  "infotext": true,
  "menu": true,
  "menutext": true,
  "scrollbar": true,
  "threeddarkshadow": true,
  "threedface": true,
  "threedhighlight": true,
  "threedlightshadow": true,
  "threedshadow": true,
  "window": true,
  "windowframe": true,
  "windowtext": true
};

CSSParser.prototype.kLIST_STYLE_TYPE_NAMES = {
  "decimal": true,
  "decimal-leading-zero": true,
  "lower-roman": true,
  "upper-roman": true,
  "georgian": true,
  "armenian": true,
  "lower-latin": true,
  "lower-alpha": true,
  "upper-latin": true,
  "upper-alpha": true,
  "lower-greek": true,
  
  "disc": true,
  "circle": true,
  "square": true,
  "none": true,
  
  /* CSS 3 */
  "box": true,
  "check": true,
  "diamond": true,
  "hyphen": true,
  
  "lower-armenian": true,
  "cjk-ideographic": true,
  "ethiopic-numeric": true,
  "hebrew": true,
  "japanese-formal": true,
  "japanese-informal": true,
  "simp-chinese-formal": true,
  "simp-chinese-informal": true,
  "syriac": true,
  "tamil": true,
  "trad-chinese-formal": true,
  "trad-chinese-informal": true,
  "upper-armenian": true,
  "arabic-indic": true,
  "binary": true,
  "bengali": true,
  "cambodian": true,
  "khmer": true,
  "devanagari": true,
  "gujarati": true,
  "gurmukhi": true,
  "kannada": true,
  "lower-hexadecimal": true,
  "lao": true,
  "malayalam": true,
  "mongolian": true,
  "myanmar": true,
  "octal": true,
  "oriya": true,
  "persian": true,
  "urdu": true,
  "telugu": true,
  "tibetan": true,
  "upper-hexadecimal": true,
  "afar": true,
  "ethiopic-halehame-aa-et": true,
  "ethiopic-halehame-am-et": true,
  "amharic-abegede": true,
  "ehiopic-abegede-am-et": true,
  "cjk-earthly-branch": true,
  "cjk-heavenly-stem": true,
  "ethiopic": true,
  "ethiopic-abegede": true,
  "ethiopic-abegede-gez": true,
  "hangul-consonant": true,
  "hangul": true,
  "hiragana-iroha": true,
  "hiragana": true,
  "katakana-iroha": true,
  "katakana": true,
  "lower-norwegian": true,
  "oromo": true,
  "ethiopic-halehame-om-et": true,
  "sidama": true,
  "ethiopic-halehame-sid-et": true,
  "somali": true,
  "ethiopic-halehame-so-et": true,
  "tigre": true,
  "ethiopic-halehame-tig": true,
  "tigrinya-er-abegede": true,
  "ethiopic-abegede-ti-er": true,
  "tigrinya-et": true,
  "ethiopic-halehame-ti-et": true,
  "upper-greek": true,
  "asterisks": true,
  "footnotes": true,
  "circled-decimal": true,
  "circled-lower-latin": true,
  "circled-upper-latin": true,
  "dotted-decimal": true,
  "double-circled-decimal": true,
  "filled-circled-decimal": true,
  "parenthesised-decimal": true,
  "parenthesised-lower-latin": true
};

CSSParser.prototype.parseCueShorthand = function(token, declarations, aAcceptPriority)
{
  var before = "";
  var after = "";
  
  var values = [];
  var values = [];
  while (true) {
    
    if (!token.isNotNull())
      break;
    
    if (token.isSymbol(";")
        || (aAcceptPriority && token.isSymbol("!"))
        || token.isSymbol("}")) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    }
    
    else if (!values.length && token.isIdent(this.kINHERIT)) {
      values.push(token.value);
    }
    
    else if (token.isIdent("none"))
      values.push(token.value);
    
    else if (token.isFunction("url(")) {
      token = this.getToken(true, true);
      var urlContent = this.parseURL(token);
      if (urlContent)
        values.push("url(" + urlContent);
      else
        return "";
    }
    else
      return "";
    
    token = this.getToken(true, true);
  }
  
  var count = values.length;
  switch (count) {
    case 1:
      before = values[0];
      after = before;
      break;
    case 2:
      before = values[0];
      after = values[1];
      break;
    default:
      return "";
  }
  this.forgetState();
  aDecl.push(this._createJscsspDeclarationFromValue("cue-before", before));
  aDecl.push(this._createJscsspDeclarationFromValue("cue-after", after));
  return before + " " + after;
};

CSSParser.prototype.parseDeclaration = function(aToken, aDecl, aAcceptPriority, aExpandShorthands, aSheet) {
  this.preserveState();
  var blocks = [];
  if (aToken.isIdent()) {
    var descriptor = aToken.value.toLowerCase();
    var token = this.getToken(true, true);
    if (token.isSymbol(":")) {
      var token = this.getToken(true, true);
      
      var value = "";
      var declarations = [];
      if (aExpandShorthands)
        switch (descriptor) {
          case "background":
            value = this.parseBackgroundShorthand(token, declarations, aAcceptPriority);
            break;
          case "margin":
          case "padding":
            value = this.parseMarginOrPaddingShorthand(token, declarations, aAcceptPriority, descriptor);
            break;
          case "border-color":
            value = this.parseBorderColorShorthand(token, declarations, aAcceptPriority);
            break;
          case "border-style":
            value = this.parseBorderStyleShorthand(token, declarations, aAcceptPriority);
            break;
          case "border-width":
            value = this.parseBorderWidthShorthand(token, declarations, aAcceptPriority);
            break;
          case "border-top":
          case "border-right":
          case "border-bottom":
          case "border-left":
          case "border":
          case "outline":
            value = this.parseBorderEdgeOrOutlineShorthand(token, declarations, aAcceptPriority, descriptor);
            break;
          case "cue":
            value = this.parseCueShorthand(token, declarations, aAcceptPriority);
            break;
          case "pause":
            value = this.parsePauseShorthand(token, declarations, aAcceptPriority);
            break;
          case "font":
            value = this.parseFontShorthand(token, declarations, aAcceptPriority);
            break;
          case "list-style":
            value = this.parseListStyleShorthand(token, declarations, aAcceptPriority);
            break;
          default:
            value = this.parseDefaultPropertyValue(token, declarations, aAcceptPriority, descriptor, aSheet);
            break;
        }
      else
        value = this.parseDefaultPropertyValue(token, declarations, aAcceptPriority, descriptor, aSheet);
      token = this.currentToken();
      if (value) // no error above
      {
        var priority = false;
        if (token.isSymbol("!")) {
          token = this.getToken(true, true);
          if (token.isIdent("important")) {
            priority = true;
            token = this.getToken(true, true);
            if (token.isSymbol(";") || token.isSymbol("}")) {
              if (token.isSymbol("}"))
                this.ungetToken();
            }
            else return "";
          }
          else return "";
        }
        else if  (token.isNotNull() && !token.isSymbol(";") && !token.isSymbol("}"))
          return "";
        for (var i = 0; i < declarations.length; i++) {
          declarations[i].priority = priority;
          aDecl.push(declarations[i]);
        }
        return descriptor + ": " + value + ";";
      }
    }
  }
  else if (aToken.isComment()) {
    if (this.mPreserveComments) {
      this.forgetState();
      var comment = new jscsspComment();
      comment.parsedCssText = aToken.value;
      aDecl.push(comment);
    }
    return aToken.value;
  }
  
  // we have an error here, let's skip it
  this.restoreState();
  var s = aToken.value;
  blocks = [];
  var token = this.getToken(false, false);
  while (token.isNotNull()) {
    s += token.value;
    if ((token.isSymbol(";") || token.isSymbol("}")) && !blocks.length) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    } else if (token.isSymbol("{")
               || token.isSymbol("(")
               || token.isSymbol("[")
               || token.isFunction()) {
      blocks.push(token.isFunction() ? "(" : token.value);
    } else if (token.isSymbol("}")
               || token.isSymbol(")")
               || token.isSymbol("]")) {
      if (blocks.length) {
        var ontop = blocks[blocks.length - 1];
        if ((token.isSymbol("}") && ontop == "{")
            || (token.isSymbol(")") && ontop == "(")
            || (token.isSymbol("]") && ontop == "[")) {
          blocks.pop();
        }
      }
    }
    token = this.getToken(false, false);
  }
  return "";
};

CSSParser.prototype.reportError = function(aMsg) {
  this.mError = aMsg;
};

CSSParser.prototype.consumeError = function() {
  var e = this.mError;
  this.mError = null;
  return e;
};

function CSSParser(aString)
{
  this.mToken = null;
  this.mLookAhead = null;
  this.mScanner = new CSSScanner(aString);
  
  this.mPreserveWS = true;
  this.mPreserveComments = true;
  
  this.mPreservedTokens = [];
  
  this.mError = null;
}

CSSParser.prototype._init = function() {
  this.mToken = null;
  this.mLookAhead = null;
};

CSSParser.prototype.parseFontFaceRule = function(aToken, aSheet) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var s = aToken.value;
  var valid = false;
  var descriptors = [];
  this.preserveState();
  var token = this.getToken(true, true);
  if (token.isNotNull()) {
    // expecting block start
    if (token.isSymbol("{")) {
      s += " " + token.value;
      var token = this.getToken(true, false);
      while (true) {
        if (token.isSymbol("}")) {
          s += "}";
          valid = true;
          break;
        } else {
          var d = this.parseDeclaration(token, descriptors, false, false, aSheet);
          s += ((d && descriptors.length) ? " " : "") + d;
        }
        token = this.getToken(true, false);
      }
    }
  }
  if (valid) {
    this.forgetState();
    var rule = new jscsspFontFaceRule();
    rule.currentLine = currentLine;
    rule.parsedCssText = s;
    rule.descriptors = descriptors;
    rule.parentStyleSheet = aSheet;
    aSheet.cssRules.push(rule)
    return true;
  }
  this.restoreState();
  return false;
};

CSSParser.prototype.parseFontShorthand = function(token, aDecl, aAcceptPriority)
{
  var kStyle = {"italic": true, "oblique": true };
  var kVariant = {"small-caps": true };
  var kWeight = { "bold": true, "bolder": true, "lighter": true,
    "100": true, "200": true, "300": true, "400": true,
    "500": true, "600": true, "700": true, "800": true,
    "900": true };
  var kSize = { "xx-small": true, "x-small": true, "small": true, "medium": true,
    "large": true, "x-large": true, "xx-large": true,
    "larger": true, "smaller": true };
  var kValues = { "caption": true, "icon": true, "menu": true, "message-box": true, "small-caption": true, "status-bar": true };
  var kFamily = { "serif": true, "sans-serif": true, "cursive": true, "fantasy": true, "monospace": true };
  
  var fStyle = null;
  var fVariant = null;
  var fWeight = null;
  var fSize = null;
  var fLineHeight = null;
  var fFamily = "";
  var fSystem = null;
  var fFamilyValues = [];
  
  var normalCount = 0;
  while (true) {
    
    if (!token.isNotNull())
      break;
    
    if (token.isSymbol(";")
        || (aAcceptPriority && token.isSymbol("!"))
        || token.isSymbol("}")) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    }
    
    else if (!fStyle && !fVariant && !fWeight
             && !fSize && !fLineHeight && !fFamily
             && !fSystem
             && token.isIdent(this.kINHERIT)) {
      fStyle = this.kINHERIT;
      fVariant = this.kINHERIT;
      fWeight = this.kINHERIT;
      fSize = this.kINHERIT;
      fLineHeight = this.kINHERIT;
      fFamily = this.kINHERIT;
      fSystem = this.kINHERIT;
    }
    
    else {
      if (!fSystem && (token.isIdent() && token.value in kValues)) {
        fSystem = token.value;
        break;
      }
      
      else {
        if (!fStyle
            && token.isIdent()
            && (token.value in kStyle)) {
          fStyle = token.value;
        }
        
        else if (!fVariant
                 && token.isIdent()
                 && (token.value in kVariant)) {
          fVariant = token.value;
        }
        
        else if (!fWeight
                 && (token.isIdent() || token.isNumber())
                 && (token.value in kWeight)) {
          fWeight = token.value;
        }
        
        else if (!fSize
                 && ((token.isIdent() && (token.value in kSize))
                     || token.isDimension()
                     || token.isPercentage())) {
                   fSize = token.value;
                   token = this.getToken(false, false);
                   if (token.isSymbol("/")) {
                     token = this.getToken(false, false);
                     if (!fLineHeight &&
                         (token.isDimension() || token.isNumber() || token.isPercentage())) {
                       fLineHeight = token.value;
                     }
                     else
                       return "";
                   }
                   else if (!token.isWhiteSpace())
                     continue;
                 }
        
        else if (token.isIdent("normal")) {
          normalCount++;
          if (normalCount > 3)
            return "";
        }
        
        else if (!fFamily && // *MUST* be last to be tested here
                 (token.isString()
                  || token.isIdent())) {
                   var lastWasComma = false;
                   while (true) {
                     if (!token.isNotNull())
                       break;
                     else if (token.isSymbol(";")
                              || (aAcceptPriority && token.isSymbol("!"))
                              || token.isSymbol("}")) {
                       this.ungetToken();
                       break;
                     }
                     else if (token.isIdent() && token.value in kFamily) {
                       var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, null);
                       value.value = token.value;
                       fFamilyValues.push(value);
                       fFamily += token.value;
                       break;
                     }
                     else if (token.isString() || token.isIdent()) {
                       var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, null);
                       value.value = token.value;
                       fFamilyValues.push(value);
                       fFamily += token.value;
                       lastWasComma = false;
                     }
                     else if (!lastWasComma && token.isSymbol(",")) {
                       fFamily += ", ";
                       lastWasComma = true;
                     }
                     else
                       return "";
                     token = this.getToken(true, true);
                   }
                 }
        
        else {
          return "";
        }
      }
      
    }
    
    token = this.getToken(true, true);
  }
  
  // create the declarations
  this.forgetState();
  if (fSystem) {
    aDecl.push(this._createJscsspDeclarationFromValue("font", fSystem));
    return fSystem;
  }
  fStyle = fStyle ? fStyle : "normal";
  fVariant = fVariant ? fVariant : "normal";
  fWeight = fWeight ? fWeight : "normal";
  fSize = fSize ? fSize : "medium";
  fLineHeight = fLineHeight ? fLineHeight : "normal";
  fFamily = fFamily ? fFamily : "-moz-initial";
  
  aDecl.push(this._createJscsspDeclarationFromValue("font-style", fStyle));
  aDecl.push(this._createJscsspDeclarationFromValue("font-variant", fVariant));
  aDecl.push(this._createJscsspDeclarationFromValue("font-weight", fWeight));
  aDecl.push(this._createJscsspDeclarationFromValue("font-size", fSize));
  aDecl.push(this._createJscsspDeclarationFromValue("line-height", fLineHeight));
  aDecl.push(this._createJscsspDeclarationFromValuesArray("font-family", fFamilyValues, fFamily));
  return fStyle + " " + fVariant + " " + fWeight + " " + fSize + "/" + fLineHeight + " " + fFamily;
};

CSSParser.prototype.parseFunctionArgument = function(token)
{
  var value = "";
  if (token.isString())
  {
    value += token.value;
    token = this.getToken(true, true);
  }
  else {
    var parenthesis = 1;
    while (true)
    {
      if (!token.isNotNull())
        return "";
      if (token.isFunction() || token.isSymbol("("))
        parenthesis++;
      if (token.isSymbol(")")) {
        parenthesis--;
        if (!parenthesis)
          break;
      }
      value += token.value;
      token = this.getToken(false, false);
    }
  }
  
  if (token.isSymbol(")"))
    return value + ")";
  return "";
};

CSSParser.prototype.parseColorStop = function(token)
{
  var color = this.parseColor(token);
  var position = "";
  if (!color)
    return null;
  token = this.getToken(true, true);
  if (token.isLength()) {
    position = token.value;
    token = this.getToken(true, true);
  }
  return { color: color, position: position }
};

CSSParser.prototype.parseGradient = function ()
{
  var kHPos = {"left": true, "right": true };
  var kVPos = {"top": true, "bottom": true };
  var kPos = {"left": true, "right": true, "top": true, "bottom": true, "center": true};
  
  var isRadial = false;
  var gradient = { isRepeating: false };
  var token = this.getToken(true, true);
  if (token.isNotNull()) {
    if (token.isFunction("linear-gradient(") ||
        token.isFunction("radial-gradient(") ||
        token.isFunction("repeating-linear-gradient(") ||
        token.isFunction("repeating-radial-gradient(")) {
      if (token.isFunction("radial-gradient(") ||
          token.isFunction("repeating-radial-gradient(")) {
        gradient.isRadial = true;
      }
      if (token.isFunction("repeating-linear-gradient(") ||
          token.isFunction("repeating-radial-gradient(")) {
        gradient.isRepeating = true;
      }
      
      
      token = this.getToken(true, true);
      var foundPosition = false;
      var haveAngle = false;
      
      /********** LINEAR **********/
      if (token.isAngle()) {
        gradient.angle = token.value;
        haveAngle = true;
        token = this.getToken(true, true);
        if (!token.isSymbol(","))
          return null;
        token = this.getToken(true, true);
      }
      
      else if (token.isIdent("to")) {
        foundPosition = true;
        token = this.getToken(true, true);
        if (token.isIdent("top")
            || token.isIdent("bottom")
            || token.isIdent("left")
            || token.isIdent("right")) {
          gradient.position = token.value;
          token = this.getToken(true, true);
          if (((gradient.position == "top" || gradient.position == "bottom") && (token.isIdent("left") || token.isIdent("right")))
              || ((gradient.position == "left" || gradient.position == "right") && (token.isIdent("top") || token.isIdent("bottom")))) {
            gradient.position += " " + token.value;
            token = this.getToken(true, true);
          }
        }
        else
          return null;
        
        if (!token.isSymbol(","))
          return null;
        token = this.getToken(true, true);
      }
      
      /********** RADIAL **********/
      else if (gradient.isRadial) {
        gradient.shape = "";
        gradient.extent = "";
        gradient.positions = [];
        gradient.at = "";
        
        while (!token.isIdent("at") && !token.isSymbol(",")) {
          if (!gradient.shape
              && (token.isIdent("circle") || token.isIdent("ellipse"))) {
            gradient.shape = token.value;
            token = this.getToken(true, true);
          }
          else if (!gradient.extent
                   && (token.isIdent("closest-corner")
                       || token.isIdent("closes-side")
                       || token.isIdent("farthest-corner")
                       || token.isIdent("farthest-corner"))) {
                     gradient.extent = token.value;
                     token = this.getToken(true, true);
                   }
          else if (gradient.positions.length < 2 && token.isLength()){
            gradient.positions.push(token.value);
            token = this.getToken(true, true);
          }
          else
            break;
        }
        
        // verify if the shape is null of well defined
        if ((gradient.positions.length == 1 && !gradient.extent && (gradient.shape == "circle" || !gradient.shape))
            || (gradient.positions.length == 2 && !gradient.extent && (gradient.shape == "ellipse" || !gradient.shape))
            || (!gradient.positions.length && gradient.extent)
            || (!gradient.positions.length && !gradient.extent)) {
          // shape ok
        }
        else  {
          return null;
        }
        
        if (token.isIdent("at")) {
          token = this.getToken(true, true);
          if (((token.isIdent() && token.value in kPos)
               || token.isDimension()
               || token.isNumber("0")
               || token.isPercentage())) {
            gradient.at = token.value;
            token = this.getToken(true, true);
            if (token.isDimension() || token.isNumber("0") || token.isPercentage()) {
              gradient.at += " " + token.value;
            }
            else if (token.isIdent() && token.value in kPos) {
              if ((gradient.at in kHPos && token.value in kHPos) ||
                  (gradient.at in kVPos && token.value in kVPos))
                return "";
              gradient.at += " " + token.value;
            }
            else {
              this.ungetToken();
              gradient.at += " center";
            }
          }
          else
            return null;
          
          token = this.getToken(true, true);
        }
        
        if (gradient.shape || gradient.extent || gradient.positions.length || gradient.at) {
          if (!token.isSymbol(","))
            return null;
          token = this.getToken(true, true);
        }
      }
      
      // now color stops...
      var stop1 = this.parseColorStop(token);
      if (!stop1)
        return null;
      token = this.currentToken();
      if (!token.isSymbol(","))
        return null;
      token = this.getToken(true, true);
      var stop2 = this.parseColorStop(token);
      if (!stop2)
        return null;
      token = this.currentToken();
      if (token.isSymbol(",")) {
        token = this.getToken(true, true);
      }
      // ok we have at least two color stops
      gradient.stops = [stop1, stop2];
      while (!token.isSymbol(")")) {
        var colorstop = this.parseColorStop(token);
        if (!colorstop)
          return null;
        token = this.currentToken();
        if (!token.isSymbol(")") && !token.isSymbol(","))
          return null;
        if (token.isSymbol(","))
          token = this.getToken(true, true);
        gradient.stops.push(colorstop);
      }
      return gradient;
    }
  }
  return null;
};

CSSParser.prototype.serializeGradient = function(gradient)
{
  var s = gradient.isRadial
  ? (gradient.isRepeating ? "repeating-radial-gradient(" : "radial-gradient(" )
  : (gradient.isRepeating ? "repeating-linear-gradient(" : "linear-gradient(" );
  if (gradient.angle || gradient.position)
    s += (gradient.angle ? gradient.angle: "") +
    (gradient.position ? "to " + gradient.position : "") +
    ", ";
  
  if (gradient.isRadial)
    s += (gradient.shape ? gradient.shape + " " : "") +
    (gradient.extent ? gradient.extent + " " : "") +
    (gradient.positions.length ? gradient.positions.join(" ") + " " : "") +
    (gradient.at ? "at " + gradient.at + " " : "") +
    (gradient.shape || gradient.extent || gradient.positions.length || gradient.at ? ", " : "");
  
  for (var i = 0; i < gradient.stops.length; i++) {
    var colorstop = gradient.stops[i];
    s += colorstop.color + (colorstop.position ? " " + colorstop.position : "");
    if (i != gradient.stops.length -1)
      s += ", ";
  }
  s += ")";
  return s;
};


CSSParser.prototype.parseImportRule = function(aToken, aSheet) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var s = aToken.value;
  this.preserveState();
  var token = this.getToken(true, true);
  var media = [];
  var href = "";
  if (token.isString()) {
    href = token.value;
    s += " " + href;
  }
  else if (token.isFunction("url(")) {
    token = this.getToken(true, true);
    var urlContent = this.parseURL(token);
    if (urlContent) {
      href = "url(" + urlContent;
      s += " " + href;
    }
  }
  else
    this.reportError(kIMPORT_RULE_MISSING_URL);
  
  if (href) {
    token = this.getToken(true, true);
    while (token.isIdent()) {
      s += " " + token.value;
      media.push(token.value);
      token = this.getToken(true, true);
      if (!token)
        break;
      if (token.isSymbol(",")) {
        s += ",";
      } else if (token.isSymbol(";")) {
        break;
      } else
        break;
      token = this.getToken(true, true);
    }
    
    if (!media.length) {
      media.push("all");
    }
    
    if (token.isSymbol(";")) {
      s += ";"
      this.forgetState();
      var rule = new jscsspImportRule();
      rule.currentLine = currentLine;
      rule.parsedCssText = s;
      rule.href = href;
      rule.media = media;
      rule.parentStyleSheet = aSheet;
      aSheet.cssRules.push(rule);
      return true;
    }
  }
  
  this.restoreState();
  this.addUnknownAtRule(aSheet, "@import");
  return false;
};

CSSParser.prototype.parseKeyframesRule = function(aToken, aSheet) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var s = aToken.value;
  var valid = false;
  var keyframesRule = new jscsspKeyframesRule();
  keyframesRule.currentLine = currentLine;
  this.preserveState();
  var token = this.getToken(true, true);
  var foundName = false;
  while (token.isNotNull()) {
    if (token.isIdent()) {
      // should be the keyframes' name
      foundName = true;
      s += " " + token.value;
      keyframesRule.name = token.value;
      token = this.getToken(true, true);
      if (token.isSymbol("{"))
        this.ungetToken();
      else {
        // error...
        token.type = jscsspToken.NULL_TYPE;
        break;
      }
    }
    else if (token.isSymbol("{")) {
      if (!foundName) {
        token.type = jscsspToken.NULL_TYPE;
        // not a valid keyframes at-rule
      }
      break;
    }
    else {
      token.type = jscsspToken.NULL_TYPE;
      // not a valid keyframes at-rule
      break;
    }
    token = this.getToken(true, true);
  }
  
  if (token.isSymbol("{") && keyframesRule.name) {
    // ok let's parse keyframe rules now...
    s += " { ";
    token = this.getToken(true, false);
    while (token.isNotNull()) {
      if (token.isComment() && this.mPreserveComments) {
        s += " " + token.value;
        var comment = new jscsspComment();
        comment.parsedCssText = token.value;
        keyframesRule.cssRules.push(comment);
      } else if (token.isSymbol("}")) {
        valid = true;
        break;
      } else {
        var r = this.parseKeyframeRule(token, keyframesRule, true);
        if (r)
          s += r;
      }
      token = this.getToken(true, false);
    }
  }
  if (valid) {
    this.forgetState();
    keyframesRule.currentLine = currentLine;
    keyframesRule.parsedCssText = s;
    aSheet.cssRules.push(keyframesRule);
    return true;
  }
  this.restoreState();
  return false;
};

CSSParser.prototype.parseKeyframeRule = function(aToken, aOwner) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  this.preserveState();
  var token = aToken;
  
  // find the keyframe keys
  var key = "";
  while (token.isNotNull()) {
    if (token.isIdent() || token.isPercentage()) {
      if (token.isIdent()
          && !token.isIdent("from")
          && !token.isIdent("to")) {
        key = "";
        break;
      }
      key += token.value;
      token = this.getToken(true, true);
      if (token.isSymbol("{")) {
        this.ungetToken();
        break;
      }
      else 
        if (token.isSymbol(",")) {
          key += ", ";
        }
        else {
          key = "";
          break;
        }
    }
    else {
      key = "";
      break;
    }
    token = this.getToken(true, true);
  }
  
  var valid = false;
  var declarations = [];
  if (key) {
    var s = key;
    token = this.getToken(true, true);
    if (token.isSymbol("{")) {
      s += " { ";
      token = this.getToken(true, false);
      while (true) {
        if (!token.isNotNull()) {
          valid = true;
          break;
        }
        if (token.isSymbol("}")) {
          s += "}";
          valid = true;
          break;
        } else {
          var d = this.parseDeclaration(token, declarations, true, true, aOwner);
          s += ((d && declarations.length) ? " " : "") + d;
        }
        token = this.getToken(true, false);
      }
    }
  }
  else {
    // key is invalid so the whole rule is invalid with it
  }
  
  if (valid) {
    var rule = new jscsspKeyframeRule();
    rule.currentLine = currentLine;
    rule.parsedCssText = s;
    rule.declarations = declarations;
    rule.keyText = key;
    rule.parentRule = aOwner;
    aOwner.cssRules.push(rule);
    return s;
  }
  this.restoreState();
  s = this.currentToken().value;
  this.addUnknownAtRule(aOwner, s);
  return "";
};

CSSParser.prototype.parseListStyleShorthand = function(token, aDecl, aAcceptPriority)
{
  var kPosition = { "inside": true, "outside": true };
  
  var lType = null;
  var lPosition = null;
  var lImage = null;
  
  while (true) {
    
    if (!token.isNotNull())
      break;
    
    if (token.isSymbol(";")
        || (aAcceptPriority && token.isSymbol("!"))
        || token.isSymbol("}")) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    }
    
    else if (!lType && !lPosition && ! lImage
             && token.isIdent(this.kINHERIT)) {
      lType = this.kINHERIT;
      lPosition = this.kINHERIT;
      lImage = this.kINHERIT;
    }
    
    else if (!lType &&
             (token.isIdent() && token.value in this.kLIST_STYLE_TYPE_NAMES)) {
      lType = token.value;
    }
    
    else if (!lPosition &&
             (token.isIdent() && token.value in kPosition)) {
      lPosition = token.value;
    }
    
    else if (!lImage && token.isFunction("url")) {
      token = this.getToken(true, true);
      var urlContent = this.parseURL(token);
      if (urlContent) {
        lImage = "url(" + urlContent;
      }
      else
        return "";
    }
    else if (!token.isIdent("none"))
      return "";
    
    token = this.getToken(true, true);
  }
  
  // create the declarations
  this.forgetState();
  lType = lType ? lType : "none";
  lImage = lImage ? lImage : "none";
  lPosition = lPosition ? lPosition : "outside";
  
  aDecl.push(this._createJscsspDeclarationFromValue("list-style-type", lType));
  aDecl.push(this._createJscsspDeclarationFromValue("list-style-position", lPosition));
  aDecl.push(this._createJscsspDeclarationFromValue("list-style-image", lImage));
  return lType + " " + lPosition + " " + lImage;
};

CSSParser.prototype.parse = function(aString, aTryToPreserveWhitespaces, aTryToPreserveComments) {
  if (!aString)
    return null; // early way out if we can
  
  this.mPreserveWS       = aTryToPreserveWhitespaces;
  this.mPreserveComments = aTryToPreserveComments;
  this.mPreservedTokens = [];
  this.mScanner.init(aString);
  var sheet = new jscsspStylesheet();
  
  // @charset can only appear at first char of the stylesheet
  var token = this.getToken(false, false);
  if (!token.isNotNull())
    return sheet;
  if (token.isAtRule("@charset")) {
    this.ungetToken();
    this.parseCharsetRule(sheet);
    token = this.getToken(false, false);
  }
  
  var foundStyleRules = false;
  var foundImportRules = false;
  var foundNameSpaceRules = false;
  while (true) {
    if (!token.isNotNull())
      break;
    if (token.isWhiteSpace())
    {
      if (aTryToPreserveWhitespaces)
        this.addWhitespace(sheet, token.value);
    }
    
    else if (token.isComment())
    {
      if (this.mPreserveComments)
        this.addComment(sheet, token.value);
    }
    
    else if (token.isAtRule()) {
      if (token.isAtRule("@variables")) {
        if (!foundImportRules && !foundStyleRules)
          this.parseVariablesRule(token, sheet);
        else {
          this.reportError(kVARIABLES_RULE_POSITION);
          this.addUnknownAtRule(sheet, token.value);
        }
      }
      else if (token.isAtRule("@import")) {
        // @import rules MUST occur before all style and namespace
        // rules
        if (!foundStyleRules && !foundNameSpaceRules)
          foundImportRules = this.parseImportRule(token, sheet);
        else {
          this.reportError(kIMPORT_RULE_POSITION);
          this.addUnknownAtRule(sheet, token.value);
        }
      }
      else if (token.isAtRule("@namespace")) {
        // @namespace rules MUST occur before all style rule and
        // after all @import rules
        if (!foundStyleRules)
          foundNameSpaceRules = this.parseNamespaceRule(token, sheet);
        else {
          this.reportError(kNAMESPACE_RULE_POSITION);
          this.addUnknownAtRule(sheet, token.value);
        }
      }
      else if (token.isAtRule("@font-face")) {
        if (this.parseFontFaceRule(token, sheet))
          foundStyleRules = true;
        else
          this.addUnknownAtRule(sheet, token.value);
      }
      else if (token.isAtRule("@page")) {
        if (this.parsePageRule(token, sheet))
          foundStyleRules = true;
        else
          this.addUnknownAtRule(sheet, token.value);
      }
      else if (token.isAtRule("@media")) {
        if (this.parseMediaRule(token, sheet))
          foundStyleRules = true;
        else
          this.addUnknownAtRule(sheet, token.value);
      }
      else if (token.isAtRule("@keyframes")) {
        if (!this.parseKeyframesRule(token, sheet))
          this.addUnknownAtRule(sheet, token.value);
      }
      else if (token.isAtRule("@charset")) {
        this.reportError(kCHARSET_RULE_CHARSET_SOF);
        this.addUnknownAtRule(sheet, token.value);
      }
      else {
        this.reportError(kUNKNOWN_AT_RULE);
        this.addUnknownAtRule(sheet, token.value);
      }
    }
    
    else // plain style rules
    {
      var ruleText = this.parseStyleRule(token, sheet, false);
      if (ruleText)
        foundStyleRules = true;
    }
    token = this.getToken(false);
  }
  
  return sheet;
};
CSSParser.prototype.parseMarginOrPaddingShorthand = function(token, aDecl, aAcceptPriority, aProperty)
{
  var top = null;
  var bottom = null;
  var left = null;
  var right = null;
  
  var values = [];
  while (true) {
    
    if (!token.isNotNull())
      break;
    
    if (token.isSymbol(";")
        || (aAcceptPriority && token.isSymbol("!"))
        || token.isSymbol("}")) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    }
    
    else if (!values.length && token.isIdent(this.kINHERIT)) {
      values.push(token.value);
      token = this.getToken(true, true);
      break;
    }
    
    else if (token.isDimension()
             || token.isNumber("0")
             || token.isPercentage()
             || token.isIdent("auto")) {
      values.push(token.value);
    }
    else
      return "";
    
    token = this.getToken(true, true);
  }
  
  var count = values.length;
  switch (count) {
    case 1:
      top = values[0];
      bottom = top;
      left = top;
      right = top;
      break;
    case 2:
      top = values[0];
      bottom = top;
      left = values[1];
      right = left;
      break;
    case 3:
      top = values[0];
      left = values[1];
      right = left;
      bottom = values[2];
      break;
    case 4:
      top = values[0];
      right = values[1];
      bottom = values[2];
      left = values[3];
      break;
    default:
      return "";
  }
  this.forgetState();
  aDecl.push(this._createJscsspDeclarationFromValue(aProperty + "-top", top));
  aDecl.push(this._createJscsspDeclarationFromValue(aProperty + "-right", right));
  aDecl.push(this._createJscsspDeclarationFromValue(aProperty + "-bottom", bottom));
  aDecl.push(this._createJscsspDeclarationFromValue(aProperty + "-left", left));
  return top + " " + right + " " + bottom + " " + left;
};

CSSParser.prototype.parseMediaQuery = function()
{
  var kCONSTRAINTS = {
    "width": true,
    "min-width": true,
    "max-width": true,
    "height": true,
    "min-height": true,
    "max-height": true,
    "device-width": true,
    "min-device-width": true,
    "max-device-width": true,
    "device-height": true,
    "min-device-height": true,
    "max-device-height": true,
    "orientation": true,
    "aspect-ratio": true,
    "min-aspect-ratio": true,
    "max-aspect-ratio": true,
    "device-aspect-ratio": true,
    "min-device-aspect-ratio": true,
    "max-device-aspect-ratio": true,
    "color": true,
    "min-color": true,
    "max-color": true,
    "color-index": true,
    "min-color-index": true,
    "max-color-index": true,
    "monochrome": true,
    "min-monochrome": true,
    "max-monochrome": true,
    "resolution": true,
    "min-resolution": true,
    "max-resolution": true,
    "scan": true,
    "grid": true
  };
  
  var m = {cssText: "", amplifier: "", medium: "", constraints: []};
  var token = this.getToken(true, true);
  
  if (token.isIdent("all") ||
      token.isIdent("aural") ||
      token.isIdent("braille") ||
      token.isIdent("handheld") ||
      token.isIdent("print") ||
      token.isIdent("projection") ||
      token.isIdent("screen") ||
      token.isIdent("tty") ||
      token.isIdent("tv")) {
    m.medium = token.value;
    m.cssText += token.value;
    token = this.getToken(true, true);
  }
  else if (token.isIdent("not") || token.isIdent("only")) {
    m.amplifier = token.value.toLowerCase();
    m.cssText += token.value.toLowerCase();
    token = this.getToken(true, true);
    if (token.isIdent("all") ||
        token.isIdent("aural") ||
        token.isIdent("braille") ||
        token.isIdent("handheld") ||
        token.isIdent("print") ||
        token.isIdent("projection") ||
        token.isIdent("screen") ||
        token.isIdent("tty") ||
        token.isIdent("tv")) {
      m.cssText += " " + token.value;
      m.medium = token.value;
      token = this.getToken(true, true);
    }
    else
      return null;
  }
  
  if (m.medium) {
    if (!token.isNotNull())
      return m;
    if (token.isIdent("and")) {
      m.cssText += " and";
      token = this.getToken(true, true);
    }
    else if (!token.isSymbol("{"))
      return null;
  }
  
  while (token.isSymbol("(")) {
    token = this.getToken(true, true);
    if (token.isIdent() && (token.value in kCONSTRAINTS)) {
      var constraint = token.value;
      token = this.getToken(true, true);
      if (token.isSymbol(":")) {
        token = this.getToken(true, true);
        var values = [];
        while (!token.isSymbol(")")) {
          values.push(token.value);
          token = this.getToken(true, true);
        }
        if (token.isSymbol(")")) {
          m.constraints.push({constraint: constraint, value: values});
          m.cssText += " (" + constraint + ": " + values.join(" ") + ")";
          token = this.getToken(true, true);
          if (token.isNotNull()) {
            if (token.isIdent("and")) {
              m.cssText += " and";
              token = this.getToken(true, true);
            }
            else if (!token.isSymbol("{"))
              return null;
          }
          else
            return m;
        }
        else
          return null;
      }
      else if (token.isSymbol(")")) {
        m.constraints.push({constraint: constraint, value: null});
        m.cssText += " (" + constraint + ")";
        token = this.getToken(true, true);
        if (token.isNotNull()) {
          if (token.isIdent("and")) {
            m.cssText += " and";
            token = this.getToken(true, true);
          }
          else
            return null;
        }
        else
          return m;
      }
      else
        return null;
    }
    else
      return null;
  }
  return m;
};

CSSParser.prototype.parseMediaRule = function(aToken, aSheet) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var s = aToken.value;
  var valid = false;
  var mediaRule = new jscsspMediaRule();
  mediaRule.currentLine = currentLine;
  this.preserveState();
  var token = this.getToken(true, true);
  var foundMedia = false;
  while (token.isNotNull()) {
    this.ungetToken();
    var mediaQuery = this.parseMediaQuery();
    token = this.currentToken();
    if (mediaQuery) {
      foundMedia = true;
      s += " " + mediaQuery.cssText;
      mediaRule.media.push(mediaQuery.cssText);
      if (token.isSymbol(",")) {
        s += ",";
      } else {
        if (token.isSymbol("{"))
          break;
        else {
          // error...
          token.type = jscsspToken.NULL_TYPE;
          break;
        }
      }
    }
    else if (token.isSymbol("{"))
      break;
    else if (foundMedia) {
      token.type = jscsspToken.NULL_TYPE;
      // not a media list
      break;
    }
    
    token = this.getToken(true, true);
  }
  if (token.isSymbol("{") && mediaRule.media.length) {
    // ok let's parse style rules now...
    s += " { ";
    token = this.getToken(true, false);
    while (token.isNotNull()) {
      if (token.isComment()) {
        if (this.mPreserveComments) {
          s += " " + token.value;
          var comment = new jscsspComment();
          comment.parsedCssText = token.value;
          mediaRule.cssRules.push(comment);
        }
      } else if (token.isSymbol("}")) {
        valid = true;
        break;
      } else {
        var r = this.parseStyleRule(token, mediaRule, true);
        if (r)
          s += r;
      }
      token = this.getToken(true, false);
    }
  }
  if (valid) {
    this.forgetState();
    mediaRule.parsedCssText = s;
    aSheet.cssRules.push(mediaRule);
    return true;
  }
  this.restoreState();
  return false;
};

CSSParser.prototype.parseNamespaceRule = function(aToken, aSheet) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var s = aToken.value;
  var valid = false;
  this.preserveState();
  var token = this.getToken(true, true);
  if (token.isNotNull()) {
    var prefix = "";
    var url = "";
    if (token.isIdent()) {
      prefix = token.value;
      s += " " + prefix;
      token = this.getToken(true, true);
    }
    if (token) {
      var foundURL = false;
      if (token.isString()) {
        foundURL = true;
        url = token.value;
        s += " " + url;
      } else if (token.isFunction("url(")) {
        // get a url here...
        token = this.getToken(true, true);
        var urlContent = this.parseURL(token);
        if (urlContent) {
          url += "url(" + urlContent;
          foundURL = true;
          s += " " + urlContent;
        }
      }
    }
    if (foundURL) {
      token = this.getToken(true, true);
      if (token.isSymbol(";")) {
        s += ";";
        this.forgetState();
        var rule = new jscsspNamespaceRule();
        rule.currentLine = currentLine;
        rule.parsedCssText = s;
        rule.prefix = prefix;
        rule.url = url;
        rule.parentStyleSheet = aSheet;
        aSheet.cssRules.push(rule);
        return true;
      }
    }
    
  }
  this.restoreState();
  this.addUnknownAtRule(aSheet, "@namespace");
  return false;
};

CSSParser.prototype.parsePageRule = function(aToken, aSheet) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var s = aToken.value;
  var valid = false;
  var declarations = [];
  this.preserveState();
  var token = this.getToken(true, true);
  var pageSelector = "";
  if (token.isSymbol(":") || token.isIdent()) {
    if (token.isSymbol(":")) {
      pageSelector = ":";
      token = this.getToken(false, false);
    }
    if (token.isIdent()) {
      pageSelector += token.value;
      s += " " + pageSelector;
      token = this.getToken(true, true);
    }
  }
  if (token.isNotNull()) {
    // expecting block start
    if (token.isSymbol("{")) {
      s += " " + token.value;
      var token = this.getToken(true, false);
      while (true) {
        if (token.isSymbol("}")) {
          s += "}";
          valid = true;
          break;
        } else {
          var d = this.parseDeclaration(token, declarations, true, true, aSheet);
          s += ((d && declarations.length) ? " " : "") + d;
        }
        token = this.getToken(true, false);
      }
    }
  }
  if (valid) {
    this.forgetState();
    var rule = new jscsspPageRule();
    rule.currentLine = currentLine;
    rule.parsedCssText = s;
    rule.pageSelector = pageSelector;
    rule.declarations = declarations;
    rule.parentStyleSheet = aSheet;
    aSheet.cssRules.push(rule)
    return true;
  }
  this.restoreState();
  return false;
};

CSSParser.prototype.parsePauseShorthand = function(token, declarations, aAcceptPriority)
{
  var before = "";
  var after = "";
  
  var values = [];
  var values = [];
  while (true) {
    
    if (!token.isNotNull())
      break;
    
    if (token.isSymbol(";")
        || (aAcceptPriority && token.isSymbol("!"))
        || token.isSymbol("}")) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    }
    
    else if (!values.length && token.isIdent(this.kINHERIT)) {
      values.push(token.value);
    }
    
    else if (token.isDimensionOfUnit("ms")
             || token.isDimensionOfUnit("s")
             || token.isPercentage()
             || token.isNumber("0"))
      values.push(token.value);
    else
      return "";
    
    token = this.getToken(true, true);
  }
  
  var count = values.length;
  switch (count) {
    case 1:
      before = values[0];
      after = before;
      break;
    case 2:
      before = values[0];
      after = values[1];
      break;
    default:
      return "";
  }
  this.forgetState();
  aDecl.push(this._createJscsspDeclarationFromValue("pause-before", before));
  aDecl.push(this._createJscsspDeclarationFromValue("pause-after", after));
  return before + " " + after;
};

CSSParser.prototype.parseDefaultPropertyValue = function(token, aDecl, aAcceptPriority, descriptor, aSheet) {
  var valueText = "";
  var blocks = [];
  var foundPriority = false;
  var values = [];
  while (token.isNotNull()) {
    
    if ((token.isSymbol(";")
         || token.isSymbol("}")
         || token.isSymbol("!"))
        && !blocks.length) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    }
    
    if (token.isIdent(this.kINHERIT)) {
      if (values.length) {
        return "";
      }
      else {
        valueText = this.kINHERIT;
        var value = new jscsspVariable(kJscsspINHERIT_VALUE, aSheet);
        values.push(value);
        token = this.getToken(true, true);
        break;
      }
    }
    else if (token.isSymbol("{")
             || token.isSymbol("(")
             || token.isSymbol("[")) {
      blocks.push(token.value);
    }
    else if (token.isSymbol("}")
             || token.isSymbol("]")) {
      if (blocks.length) {
        var ontop = blocks[blocks.length - 1];
        if ((token.isSymbol("}") && ontop == "{")
            || (token.isSymbol(")") && ontop == "(")
            || (token.isSymbol("]") && ontop == "[")) {
          blocks.pop();
        }
      }
    }
    // XXX must find a better way to store individual values
    // probably a |values: []| field holding dimensions, percentages
    // functions, idents, numbers and symbols, in that order.
    if (token.isFunction()) {
      if (token.isFunction("var(")) {
        token = this.getToken(true, true);
        if (token.isIdent()) {
          var name = token.value;
          token = this.getToken(true, true);
          if (token.isSymbol(")")) {
            var value = new jscsspVariable(kJscsspVARIABLE_VALUE, aSheet);
            valueText += "var(" + name + ")";
            value.name = name;
            values.push(value);
          }
          else
            return "";
        }
        else
          return "";
      }
      else {
        var fn = token.value;
        token = this.getToken(false, true);
        var arg = this.parseFunctionArgument(token);
        if (arg) {
          valueText += fn + arg;
          var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, aSheet);
          value.value = fn + arg;
          values.push(value);
        }
        else
          return "";
      }
    }
    else if (token.isSymbol("#")) {
      var color = this.parseColor(token);
      if (color) {
        valueText += color;
        var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, aSheet);
        value.value = color;
        values.push(value);
      }
      else
        return "";
    }
    else if (!token.isWhiteSpace() && !token.isSymbol(",")) {
      var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, aSheet);
      value.value = token.value;
      values.push(value);
      valueText += token.value;
    }
    else
      valueText += token.value;
    token = this.getToken(false, true);
  }
  if (values.length && valueText) {
    this.forgetState();
    aDecl.push(this._createJscsspDeclarationFromValuesArray(descriptor, values, valueText));
    return valueText;
  }
  return "";
};

CSSParser.prototype.parseSelector = function(aToken, aParseSelectorOnly) {
  var s = "";
  var specificity = {a: 0, b: 0, c: 0, d: 0}; // CSS 2.1 section 6.4.3
  var isFirstInChain = true;
  var token = aToken;
  var valid = false;
  var combinatorFound = false;
  while (true) {
    if (!token.isNotNull()) {
      if (aParseSelectorOnly)
        return {selector: s, specificity: specificity };
      return "";
    }
    
    if (!aParseSelectorOnly && token.isSymbol("{")) {
      // end of selector
      valid = !combinatorFound;
      // don't unget if invalid since addUnknownRule is going to restore state anyway
      if (valid)
        this.ungetToken();
      break;
    }
    
    if (token.isSymbol(",")) { // group of selectors
      s += token.value;
      isFirstInChain = true;
      combinatorFound = false;
      token = this.getToken(false, true);
      continue;
    }
    // now combinators and grouping...
    else if (!combinatorFound
             && (token.isWhiteSpace()
                 || token.isSymbol(">")
                 || token.isSymbol("+")
                 || token.isSymbol("~"))) {
               if (token.isWhiteSpace()) {
                 s += " ";
                 var nextToken = this.lookAhead(true, true);
                 if (!nextToken.isNotNull()) {
                   if (aParseSelectorOnly)
                     return {selector: s, specificity: specificity };
                   return "";
                 }
                 if (nextToken.isSymbol(">")
                     || nextToken.isSymbol("+")
                     || nextToken.isSymbol("~")) {
                   token = this.getToken(true, true);
                   s += token.value + " ";
                   combinatorFound = true;
                 }
               }
               else {
                 s += token.value;
                 combinatorFound = true;
               }
               isFirstInChain = true;
               token = this.getToken(true, true);
               continue;
             }
    else {
      var simpleSelector = this.parseSimpleSelector(token, isFirstInChain, true);
      if (!simpleSelector)
        break; // error
      s += simpleSelector.selector;
      specificity.b += simpleSelector.specificity.b;
      specificity.c += simpleSelector.specificity.c;
      specificity.d += simpleSelector.specificity.d;
      isFirstInChain = false;
      combinatorFound = false;
    }
    
    token = this.getToken(false, true);
  }
  
  if (valid) {
    return {selector: s, specificity: specificity };
  }
  return "";
};

CSSParser.prototype.isPseudoElement = function(aIdent)
{
  switch (aIdent) {
    case "first-letter":
    case "first-line":
    case "before":
    case "after":
    case "marker":
      return true;
      break;
    default: 
      break;
  }
  return false;
};

CSSParser.prototype.parseSimpleSelector = function(token, isFirstInChain, canNegate)
{
  var s = "";
  var specificity = {a: 0, b: 0, c: 0, d: 0}; // CSS 2.1 section 6.4.3
  
  if (isFirstInChain
      && (token.isSymbol("*") || token.isSymbol("|") || token.isIdent())) {
    // type or universal selector
    if (token.isSymbol("*") || token.isIdent()) {
      // we don't know yet if it's a prefix or a universal
      // selector
      s += token.value;
      var isIdent = token.isIdent();
      token = this.getToken(false, true);
      if (token.isSymbol("|")) {
        // it's a prefix
        s += token.value;
        token = this.getToken(false, true);
        if (token.isIdent() || token.isSymbol("*")) {
          // ok we now have a type element or universal
          // selector
          s += token.value;
          if (token.isIdent())
            specificity.d++;
        } else
          // oops that's an error...
          return null;
      } else {
        this.ungetToken();
        if (isIdent)
          specificity.d++;
      }
    } else if (token.isSymbol("|")) {
      s += token.value;
      token = this.getToken(false, true);
      if (token.isIdent() || token.isSymbol("*")) {
        s += token.value;
        if (token.isIdent())
          specificity.d++;
      } else
        // oops that's an error
        return null;
    }
  }
  
  else if (token.isSymbol(".") || token.isSymbol("#")) {
    var isClass = token.isSymbol(".");
    s += token.value;
    token = this.getToken(false, true);
    if (token.isIdent()) {
      s += token.value;
      if (isClass)
        specificity.c++;
      else
        specificity.b++;
    }
    else
      return null;
  }
  
  else if (token.isSymbol(":")) {
    s += token.value;
    token = this.getToken(false, true);
    if (token.isSymbol(":")) {
      s += token.value;
      token = this.getToken(false, true);
    }
    if (token.isIdent()) {
      s += token.value;
      if (this.isPseudoElement(token.value))
        specificity.d++;
      else
        specificity.c++;
    }
    else if (token.isFunction()) {
      s += token.value;
      if (token.isFunction(":not(")) {
        if (!canNegate)
          return null;
        token = this.getToken(true, true);
        var simpleSelector = this.parseSimpleSelector(token, isFirstInChain, false);
        if (!simpleSelector)
          return null;
        else {
          s += simpleSelector.selector;
          token = this.getToken(true, true);
          if (token.isSymbol(")"))
            s += ")";
          else
            return null;
        }
        specificity.c++;
      }
      else {
        while (true) {
          token = this.getToken(false, true);
          if (token.isSymbol(")")) {
            s += ")";
            break;
          } else
            s += token.value;
        }
        specificity.c++;
      }
    } else
      return null;
    
  } else if (token.isSymbol("[")) {
    s += "[";
    token = this.getToken(true, true);
    if (token.isIdent() || token.isSymbol("*")) {
      s += token.value;
      var nextToken = this.getToken(true, true);
      if (nextToken.isSymbol("|")) {
        s += "|";
        token = this.getToken(true, true);
        if (token.isIdent())
          s += token.value;
        else
          return null;
      } else
        this.ungetToken();
    } else if (token.isSymbol("|")) {
      s += "|";
      token = this.getToken(true, true);
      if (token.isIdent())
        s += token.value;
      else
        return null;
    }
    else
      return null;
    
    // nothing, =, *=, $=, ^=, |=
    token = this.getToken(true, true);
    if (token.isIncludes()
        || token.isDashmatch()
        || token.isBeginsmatch()
        || token.isEndsmatch()
        || token.isContainsmatch()
        || token.isSymbol("=")) {
      s += token.value;
      token = this.getToken(true, true);
      if (token.isString() || token.isIdent()) {
        s += token.value;
        token = this.getToken(true, true);
      }
      else
        return null;
      
      if (token.isSymbol("]")) {
        s += token.value;
        specificity.c++;
      }
      else
        return null;
    }
    else if (token.isSymbol("]")) {
      s += token.value;
      specificity.c++;
    }
    else
      return null;
    
  }
  else if (token.isWhiteSpace()) {
    var t = this.lookAhead(true, true);
    if (t.isSymbol('{'))
      return ""
      }
  if (s)
    return {selector: s, specificity: specificity };
  return null;
};

CSSParser.prototype.trim11 = function(str) {
  str = str.replace(/^\s+/, '');
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test( str.charAt(i) )) { // XXX charat
      str = str.substring(0, i + 1);
      break;
    }
  }
  return str;
};

CSSParser.prototype.parseStyleRule = function(aToken, aOwner, aIsInsideMediaRule)
{
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  this.preserveState();
  // first let's see if we have a selector here...
  var selector = this.parseSelector(aToken, false);
  var valid = false;
  var declarations = [];
  if (selector) {
    selector = this.trim11(selector.selector);
    var s = selector;
    var token = this.getToken(true, true);
    if (token.isSymbol("{")) {
      s += " { ";
      var token = this.getToken(true, false);
      while (true) {
        if (!token.isNotNull()) {
          valid = true;
          break;
        }
        if (token.isSymbol("}")) {
          s += "}";
          valid = true;
          break;
        } else {
          var d = this.parseDeclaration(token, declarations, true, true, aOwner);
          s += ((d && declarations.length) ? " " : "") + d;
        }
        token = this.getToken(true, false);
      }
    }
  }
  else {
    // selector is invalid so the whole rule is invalid with it
  }
  
  if (valid) {
    var rule = new jscsspStyleRule();
    rule.currentLine = currentLine;
    rule.parsedCssText = s;
    rule.declarations = declarations;
    rule.mSelectorText = selector;
    if (aIsInsideMediaRule)
      rule.parentRule = aOwner;
    else
      rule.parentStyleSheet = aOwner;
    aOwner.cssRules.push(rule);
    return s;
  }
  this.restoreState();
  s = this.currentToken().value;
  this.addUnknownAtRule(aOwner, s);
  return "";
};

CSSParser.prototype.parseTextShadows = function()
{
  var shadows = [];
  var token = this.getToken(true, true);
  var color = "", blurRadius = "0px", offsetX = "0px", offsetY = "0px"; 
  while (token.isNotNull()) {
    if (token.isIdent("none")) {
      shadows.push( { none: true } );
      token = this.getToken(true, true);
    }
    else {
      if (token.isFunction("rgb(") ||
          token.isFunction("rgba(") ||
          token.isFunction("hsl(") ||
          token.isFunction("hsla(") ||
          token.isSymbol("#") ||
          token.isIdent()) {
        var color = this.parseColor(token);
        token = this.getToken(true, true);
      }
      if (token.isPercentage() ||
          token.isDimensionOfUnit("cm") ||
          token.isDimensionOfUnit("mm") ||
          token.isDimensionOfUnit("in") ||
          token.isDimensionOfUnit("pc") ||
          token.isDimensionOfUnit("px") ||
          token.isDimensionOfUnit("em") ||
          token.isDimensionOfUnit("ex") ||
          token.isDimensionOfUnit("pt")) {
        var offsetX = token.value;
        token = this.getToken(true, true);
      }
      else
        return [];
      if (token.isPercentage() ||
          token.isDimensionOfUnit("cm") ||
          token.isDimensionOfUnit("mm") ||
          token.isDimensionOfUnit("in") ||
          token.isDimensionOfUnit("pc") ||
          token.isDimensionOfUnit("px") ||
          token.isDimensionOfUnit("em") ||
          token.isDimensionOfUnit("ex") ||
          token.isDimensionOfUnit("pt")) {
        var offsetY = token.value;
        token = this.getToken(true, true);
      }
      else
        return [];
      if (token.isPercentage() ||
          token.isDimensionOfUnit("cm") ||
          token.isDimensionOfUnit("mm") ||
          token.isDimensionOfUnit("in") ||
          token.isDimensionOfUnit("pc") ||
          token.isDimensionOfUnit("px") ||
          token.isDimensionOfUnit("em") ||
          token.isDimensionOfUnit("ex") ||
          token.isDimensionOfUnit("pt")) {
        var blurRadius = token.value;
        token = this.getToken(true, true);
      }
      if (!color &&
          (token.isFunction("rgb(") ||
           token.isFunction("rgba(") ||
           token.isFunction("hsl(") ||
           token.isFunction("hsla(") ||
           token.isSymbol("#") ||
           token.isIdent())) {
            var color = this.parseColor(token);
            token = this.getToken(true, true);
          }
      
      shadows.push( { none: false,
                   color: color,
                   offsetX: offsetX, offsetY: offsetY,
                   blurRadius: blurRadius } );
      
      if (token.isSymbol(",")) {
        color = "";
        blurRadius = "0px";
        offsetX = "0px";
        offsetY = "0px"; 
        token = this.getToken(true, true);
      }
      else if (!token.isNotNull())
        return shadows;
      else
        return [];
    }
  }
  return shadows;
};

CSSParser.prototype.currentToken = function() {
  return this.mToken;
};

CSSParser.prototype.getHexValue = function() {
  this.mToken = this.mScanner.nextHexValue();
  return this.mToken;
};

CSSParser.prototype.getToken = function(aSkipWS, aSkipComment) {
  if (this.mLookAhead) {
    this.mToken = this.mLookAhead;
    this.mLookAhead = null;
    return this.mToken;
  }
  
  this.mToken = this.mScanner.nextToken();
  while (this.mToken &&
         ((aSkipWS && this.mToken.isWhiteSpace()) ||
          (aSkipComment && this.mToken.isComment())))
    this.mToken = this.mScanner.nextToken();
  return this.mToken;
};

CSSParser.prototype.lookAhead = function(aSkipWS, aSkipComment) {
  var preservedToken = this.mToken;
  this.mScanner.preserveState();
  var token = this.getToken(aSkipWS, aSkipComment);
  this.mScanner.restoreState();
  this.mToken = preservedToken;
  
  return token;
};

CSSParser.prototype.ungetToken = function() {
  this.mLookAhead = this.mToken;
};

CSSParser.prototype.addWhitespace = function(aSheet, aString) {
  var rule = new jscsspWhitespace();
  rule.parsedCssText = aString;
  rule.parentStyleSheet = aSheet;
  aSheet.cssRules.push(rule);
};

CSSParser.prototype.addComment = function(aSheet, aString) {
  var rule = new jscsspComment();
  rule.parsedCssText = aString;
  rule.parentStyleSheet = aSheet;
  aSheet.cssRules.push(rule);
};

CSSParser.prototype._createJscsspDeclaration = function(property, value)
{
  var decl = new jscsspDeclaration();
  decl.property = property;
  decl.value = this.trim11(value);
  decl.parsedCssText = property + ": " + value + ";";
  return decl;
};

CSSParser.prototype._createJscsspDeclarationFromValue = function(property, valueText)
{
  var decl = new jscsspDeclaration();
  decl.property = property;
  var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, null);
  value.value = valueText;
  decl.values = [value];
  decl.valueText = valueText;
  decl.parsedCssText = property + ": " + valueText + ";";
  return decl;
};

CSSParser.prototype._createJscsspDeclarationFromValuesArray = function(property, values, valueText)
{
  var decl = new jscsspDeclaration();
  decl.property = property;
  decl.values = values;
  decl.valueText = valueText;
  decl.parsedCssText = property + ": " + valueText + ";";
  return decl;
};

CSSParser.prototype.preserveState = function() {
  this.mPreservedTokens.push(this.currentToken());
  this.mScanner.preserveState();
};

CSSParser.prototype.restoreState = function() {
  if (this.mPreservedTokens.length) {
    this.mScanner.restoreState();
    this.mToken = this.mPreservedTokens.pop();
  }
};

CSSParser.prototype.forgetState = function() {
  if (this.mPreservedTokens.length) {
    this.mScanner.forgetState();
    this.mPreservedTokens.pop();
  }
};

CSSParser.prototype.addUnknownAtRule = function(aSheet, aString) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var blocks = [];
  var token = this.getToken(false, false);
  while (token.isNotNull()) {
    aString += token.value;
    if (token.isSymbol(";") && !blocks.length)
      break;
    else if (token.isSymbol("{")
             || token.isSymbol("(")
             || token.isSymbol("[")
             || token.type == "function") {
      blocks.push(token.isFunction() ? "(" : token.value);
    } else if (token.isSymbol("}")
               || token.isSymbol(")")
               || token.isSymbol("]")) {
      if (blocks.length) {
        var ontop = blocks[blocks.length - 1];
        if ((token.isSymbol("}") && ontop == "{")
            || (token.isSymbol(")") && ontop == "(")
            || (token.isSymbol("]") && ontop == "[")) {
          blocks.pop();
          if (!blocks.length && token.isSymbol("}"))
            break;
        }
      }
    }
    token = this.getToken(false, false);
  }
  
  this.addUnknownRule(aSheet, aString, currentLine);
};

CSSParser.prototype.addUnknownRule = function(aSheet, aString, aCurrentLine) {
  var errorMsg = this.consumeError();
  var rule = new jscsspErrorRule(errorMsg);
  rule.currentLine = aCurrentLine;
  rule.parsedCssText = aString;
  rule.parentStyleSheet = aSheet;
  aSheet.cssRules.push(rule);
};

CSSParser.prototype.parseURL = function(token)
{
  var value = "";
  if (token.isString())
  {
    value += token.value;
    token = this.getToken(true, true);
  }
  else
    while (true)
    {
      if (!token.isNotNull()) {
        this.reportError(kURL_EOF);
        return "";
      }
      if (token.isWhiteSpace()) {
        nextToken = this.lookAhead(true, true);
        // if next token is not a closing parenthesis, that's an error
        if (!nextToken.isSymbol(")")) {
          this.reportError(kURL_WS_INSIDE);
          token = this.currentToken();
          break;
        }
      }
      if (token.isSymbol(")")) {
        break;
      }
      value += token.value;
      token = this.getToken(false, false);
    }
  
  if (token.isSymbol(")")) {
    return value + ")";
  }
  return "";
};

CSSParser.prototype.parseVariablesRule = function(token, aSheet) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var s = token.value;
  var declarations = [];
  var valid = false;
  this.preserveState();
  token = this.getToken(true, true);
  var media = [];
  var foundMedia = false;
  while (token.isNotNull()) {
    if (token.isIdent()) {
      foundMedia = true;
      s += " " + token.value;
      media.push(token.value);
      token = this.getToken(true, true);
      if (token.isSymbol(",")) {
        s += ",";
      } else {
        if (token.isSymbol("{"))
          this.ungetToken();
        else {
          // error...
          token.type = jscsspToken.NULL_TYPE;
          break;
        }
      }
    } else if (token.isSymbol("{"))
      break;
    else if (foundMedia) {
      token.type = jscsspToken.NULL_TYPE;
      // not a media list
      break;
    }
    token = this.getToken(true, true);
  }
  
  if (token.isSymbol("{")) {
    s += " {";
    token = this.getToken(true, true);
    while (true) {
      if (!token.isNotNull()) {
        valid = true;
        break;
      }
      if (token.isSymbol("}")) {
        s += "}";
        valid = true;
        break;
      } else {
        var d = this.parseDeclaration(token, declarations, true, false, aSheet);
        s += ((d && declarations.length) ? " " : "") + d;
      }
      token = this.getToken(true, false);
    }
  }
  if (valid) {
    this.forgetState();
    var rule = new jscsspVariablesRule();
    rule.currentLine = currentLine;
    rule.parsedCssText = s;
    rule.declarations = declarations;
    rule.media = media;
    rule.parentStyleSheet = aSheet;
    aSheet.cssRules.push(rule)
    return true;
  }
  this.restoreState();
  return false;
};

function jscsspToken(aType, aValue, aUnit)
{
  this.type = aType;
  this.value = aValue;
  this.unit = aUnit;
}

jscsspToken.NULL_TYPE = 0;

jscsspToken.WHITESPACE_TYPE = 1;
jscsspToken.STRING_TYPE = 2;
jscsspToken.COMMENT_TYPE = 3;
jscsspToken.NUMBER_TYPE = 4;
jscsspToken.IDENT_TYPE = 5;
jscsspToken.FUNCTION_TYPE = 6;
jscsspToken.ATRULE_TYPE = 7;
jscsspToken.INCLUDES_TYPE = 8;
jscsspToken.DASHMATCH_TYPE = 9;
jscsspToken.BEGINSMATCH_TYPE = 10;
jscsspToken.ENDSMATCH_TYPE = 11;
jscsspToken.CONTAINSMATCH_TYPE = 12;
jscsspToken.SYMBOL_TYPE = 13;
jscsspToken.DIMENSION_TYPE = 14;
jscsspToken.PERCENTAGE_TYPE = 15;
jscsspToken.HEX_TYPE = 16;

jscsspToken.prototype = {

  isNotNull: function ()
  {
    return this.type;
  },

  _isOfType: function (aType, aValue)
  {
    return (this.type == aType && (!aValue || this.value.toLowerCase() == aValue));
  },

  isWhiteSpace: function(w)
  {
    return this._isOfType(jscsspToken.WHITESPACE_TYPE, w);
  },

  isString: function()
  {
    return this._isOfType(jscsspToken.STRING_TYPE);
  },

  isComment: function()
  {
    return this._isOfType(jscsspToken.COMMENT_TYPE);
  },

  isNumber: function(n)
  {
    return this._isOfType(jscsspToken.NUMBER_TYPE, n);
  },

  isIdent: function(i)
  {
    return this._isOfType(jscsspToken.IDENT_TYPE, i);
  },

  isFunction: function(f)
  {
    return this._isOfType(jscsspToken.FUNCTION_TYPE, f);
  },

  isAtRule: function(a)
  {
    return this._isOfType(jscsspToken.ATRULE_TYPE, a);
  },

  isIncludes: function()
  {
    return this._isOfType(jscsspToken.INCLUDES_TYPE);
  },

  isDashmatch: function()
  {
    return this._isOfType(jscsspToken.DASHMATCH_TYPE);
  },

  isBeginsmatch: function()
  {
    return this._isOfType(jscsspToken.BEGINSMATCH_TYPE);
  },

  isEndsmatch: function()
  {
    return this._isOfType(jscsspToken.ENDSMATCH_TYPE);
  },

  isContainsmatch: function()
  {
    return this._isOfType(jscsspToken.CONTAINSMATCH_TYPE);
  },

  isSymbol: function(c)
  {
    return this._isOfType(jscsspToken.SYMBOL_TYPE, c);
  },

  isDimension: function()
  {
    return this._isOfType(jscsspToken.DIMENSION_TYPE);
  },

  isPercentage: function()
  {
    return this._isOfType(jscsspToken.PERCENTAGE_TYPE);
  },

  isHex: function()
  {
    return this._isOfType(jscsspToken.HEX_TYPE);
  },

  isDimensionOfUnit: function(aUnit)
  {
    return (this.isDimension() && this.unit == aUnit);
  },

  isLength: function()
  {
    return (this.isPercentage() ||
            this.isDimensionOfUnit("cm") ||
            this.isDimensionOfUnit("mm") ||
            this.isDimensionOfUnit("in") ||
            this.isDimensionOfUnit("pc") ||
            this.isDimensionOfUnit("px") ||
            this.isDimensionOfUnit("em") ||
            this.isDimensionOfUnit("ex") ||
            this.isDimensionOfUnit("pt"));
  },

  isAngle: function()
  {
    return (this.isDimensionOfUnit("deg") ||
            this.isDimensionOfUnit("rad") ||
            this.isDimensionOfUnit("grad"));
  }
}

/* kJscsspCHARSET_RULE */

function jscsspCharsetRule()
{
  this.type = kJscsspCHARSET_RULE;
  this.encoding = null;
  this.parsedCssText = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspCharsetRule.prototype = {

  cssText: function() {
    return "@charset " + this.encoding + ";";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    if (parser.parseCharsetRule(sheet)) {
      var newRule = sheet.cssRules[0];
      this.encoding = newRule.encoding;
      this.parsedCssText = newRule.parsedCssText;
      return;
    }
    throw DOMException.SYNTAX_ERR;
  }
};

/* kJscsspCOMMENT */

function jscsspComment()
{
  this.type = kJscsspCOMMENT;
  this.parsedCssText = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspComment.prototype = {
  cssText: function() {
    return this.parsedCssText;
  },

  setCssText: function(val) {
    var parser = new CSSParser(val);
    var token = parser.getToken(true, false);
    if (token.isComment())
      this.parsedCssText = token.value;
    else
      throw DOMException.SYNTAX_ERR;
  }
};

/* kJscsspSTYLE_DECLARATION */

function jscsspDeclaration()
{
  this.type = kJscsspSTYLE_DECLARATION;
  this.property = null;
  this.values = [];
  this.valueText = null;
  this.priority = null;
  this.parsedCssText = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspDeclaration.prototype = {
  kCOMMA_SEPARATED: {
    "cursor": true,
    "font-family": true,
    "voice-family": true,
    "background-image": true
  },

  kUNMODIFIED_COMMA_SEPARATED_PROPERTIES: {
    "text-shadow": true,
    "box-shadow": true,
    "-moz-transition": true,
    "-moz-transition-property": true,
    "-moz-transition-duration": true,
    "-moz-transition-timing-function": true,
    "-moz-transition-delay": true,
    "src": true,
    "-moz-font-feature-settings": true
  },

  cssText: function() {
    var prefixes = PrefixHelper.prefixesForProperty(this.property);

    var rv = "";
    if (this.property in this.kUNMODIFIED_COMMA_SEPARATED_PROPERTIES) {
      if (prefixes) {
        rv = "";
        for (var propertyIndex = 0; propertyIndex < prefixes.length; propertyIndex++) {
          var property = prefixes[propertyIndex];
          rv += (propertyIndex ? gTABS : "") + property + ": ";
          rv += this.valueText + (this.priority ? " !important" : "") + ";";
          rv += ((prefixes.length > 1 && propertyIndex != prefixes.length -1) ? "\n" : "");
        }
        return rv;
      }
      return this.property + ": " + this.valueText +
             (this.priority ? " !important" : "") + ";"
    }

    if (prefixes) {
      rv = "";
      for (var propertyIndex = 0; propertyIndex < prefixes.length; propertyIndex++) {
        var property = prefixes[propertyIndex];
        rv += (propertyIndex ? gTABS : "") + property + ": ";
        var separator = (property in this.kCOMMA_SEPARATED) ? ", " : " ";
        for (var i = 0; i < this.values.length; i++)
          if (this.values[i].cssText() != null)
            rv += (i ? separator : "") + this.values[i].cssText();
          else
            return null;
        rv += (this.priority ? " !important" : "") + ";" +
              ((prefixes.length > 1 && propertyIndex != prefixes.length -1) ? "\n" : "");
      }
      return rv;
    }

    var separator = (this.property in this.kCOMMA_SEPARATED) ? ", " : " ";
    var extras = {"webkit": false, "presto": false, "trident": false, "gecko1.9.2": false, "generic": false }
    for (var i = 0; i < this.values.length; i++) {
      var v = this.values[i].cssText();
      if (v != null) {
        var paren = v.indexOf("(");
        var kwd = v;
        if (paren != -1)
          kwd = v.substr(0, paren);
        if (kwd in kCSS_VENDOR_VALUES) {
          for (var j in kCSS_VENDOR_VALUES[kwd]) {
            extras[j] = extras[j] || (kCSS_VENDOR_VALUES[kwd][j] != "");
          }
        }
      }
      else
        return null;
    }

    for (var j in extras) {
      if (extras[j]) {
        var str = "\n" + gTABS +  this.property + ": ";
        for (var i = 0; i < this.values.length; i++) {
          var v = this.values[i].cssText();
          if (v != null) {
            var paren = v.indexOf("(");
            var kwd = v;
            if (paren != -1)
              kwd = v.substr(0, paren);
            if (kwd in kCSS_VENDOR_VALUES) {
              functor = kCSS_VENDOR_VALUES[kwd][j];
              if (functor) {
                v = (typeof functor == "string") ? functor : functor(v, j);
                if (!v) {
                  str = null;
                  break;
                }
              }
            }
            str += (i ? separator : "") + v;
          }
          else
            return null;
        }
        if (str)
          rv += str + ";"
        else
          rv += "\n" + gTABS + "/* Impossible to translate property " + this.property + " for " + j + " */";
      }
    }

    rv += "\n" + gTABS + this.property + ": ";
    for (var i = 0; i < this.values.length; i++) {
      var v = this.values[i].cssText();
      if (v != null) {
        rv += (i ? separator : "") + v;
      }
    }
    rv += (this.priority ? " !important" : "") + ";";

    return rv;
  },

  setCssText: function(val) {
    var declarations = [];
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (parser.parseDeclaration(token, declarations, true, true, null)
        && declarations.length
        && declarations[0].type == kJscsspSTYLE_DECLARATION) {
      var newDecl = declarations.cssRules[0];
      this.property = newDecl.property;
      this.value = newDecl.value;
      this.priority = newDecl.priority;
      this.parsedCssText = newRule.parsedCssText;
      return;
    }
    throw DOMException.SYNTAX_ERR;
  }
};

/* kJscsspUNKNOWN_RULE */

function jscsspErrorRule(aErrorMsg)
{
  this.error = aErrorMsg ? aErrorMsg : "INVALID"; 
  this.type = kJscsspUNKNOWN_RULE;
  this.parsedCssText = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspErrorRule.prototype = {
  cssText: function() {
    return this.parsedCssText;
  }
};

/* kJscsspFONT_FACE_RULE */

function jscsspFontFaceRule()
{
  this.type = kJscsspFONT_FACE_RULE;
  this.parsedCssText = null;
  this.descriptors = [];
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspFontFaceRule.prototype = {
  cssText: function() {
    var rv = gTABS + "@font-face {\n";
    var preservedGTABS = gTABS;
    gTABS += "  ";
    for (var i = 0; i < this.descriptors.length; i++)
      rv += gTABS + this.descriptors[i].cssText() + "\n";
    gTABS = preservedGTABS;
    return rv + gTABS + "}";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (token.isAtRule("@font-face")) {
      if (parser.parseFontFaceRule(token, sheet)) {
        var newRule = sheet.cssRules[0];
        this.descriptors = newRule.descriptors;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

/* kJscsspIMPORT_RULE */

function jscsspImportRule()
{
  this.type = kJscsspIMPORT_RULE;
  this.parsedCssText = null;
  this.href = null;
  this.media = []; 
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspImportRule.prototype = {
  cssText: function() {
    var mediaString = this.media.join(", ");
    return "@import " + this.href
                      + ((mediaString && mediaString != "all") ? mediaString + " " : "")
                      + ";";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (token.isAtRule("@import")) {
      if (parser.parseImportRule(token, sheet)) {
        var newRule = sheet.cssRules[0];
        this.href = newRule.href;
        this.media = newRule.media;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

/* kJscsspKEYFRAME_RULE */
function jscsspKeyframeRule()
{
  this.type = kJscsspKEYFRAME_RULE;
  this.parsedCssText = null;
  this.declarations = []
  this.keyText = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspKeyframeRule.prototype = {
  cssText: function() {
    var rv = this.keyText + " {\n";
    var preservedGTABS = gTABS;
    gTABS += "  ";
    for (var i = 0; i < this.declarations.length; i++) {
      var declText = this.declarations[i].cssText();
      if (declText)
        rv += gTABS + this.declarations[i].cssText() + "\n";
    }
    gTABS = preservedGTABS;
    return rv + gTABS + "}";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (!token.isNotNull()) {
      if (parser.parseKeyframeRule(token, sheet, false)) {
        var newRule = sheet.cssRules[0];
        this.keyText = newRule.keyText;
        this.declarations = newRule.declarations;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

/* kJscsspKEYFRAMES_RULE */
function jscsspKeyframesRule()
{
  this.type = kJscsspKEYFRAMES_RULE;
  this.parsedCssText = null;
  this.cssRules = [];
  this.name = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspKeyframesRule.prototype = {
  cssText: function() {
    var rv = "";
    var prefixes = ["moz", "webkit", "ms", "o", ""];
    for (var p = 0; p < prefixes.length; p++) {
      rv += gTABS
            + "@" + (prefixes[p] ? "-" + prefixes[p] + "-" : "") + "keyframes "
            + this.name + " {\n";
      var preservedGTABS = gTABS;
      gTABS += "  ";
      for (var i = 0; i < this.cssRules.length; i++)
        rv += gTABS + this.cssRules[i].cssText() + "\n";
      gTABS = preservedGTABS;
      rv += gTABS + "}\n\n";
    }
    return rv;
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (token.isAtRule("@-mozkeyframes")) {
      if (parser.parseKeyframesRule(token, sheet)) {
        var newRule = sheet.cssRules[0];
        this.cssRules = newRule.cssRules;
        this.name = newRule.name;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

/* kJscsspMEDIA_RULE */

function jscsspMediaRule()
{
  this.type = kJscsspMEDIA_RULE;
  this.parsedCssText = null;
  this.cssRules = [];
  this.media = [];
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspMediaRule.prototype = {
  cssText: function() {
    var rv = gTABS + "@media " + this.media.join(", ") + " {\n";
    var preservedGTABS = gTABS;
    gTABS += "  ";
    for (var i = 0; i < this.cssRules.length; i++)
      rv += this.cssRules[i].cssText() + "\n";
    gTABS = preservedGTABS;
    return rv + gTABS + "}";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (token.isAtRule("@media")) {
      if (parser.parseMediaRule(token, sheet)) {
        var newRule = sheet.cssRules[0];
        this.cssRules = newRule.cssRules;
        this.media = newRule.media;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

/* kJscsspNAMESPACE_RULE */

function jscsspNamespaceRule()
{
  this.type = kJscsspNAMESPACE_RULE;
  this.parsedCssText = null;
  this.prefix = null;
  this.url = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspNamespaceRule.prototype = {
  cssText: function() {
    return "@namespace " + (this.prefix ? this.prefix + " ": "")
                        + this.url
                        + ";";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (token.isAtRule("@namespace")) {
      if (parser.parseNamespaceRule(token, sheet)) {
        var newRule = sheet.cssRules[0];
        this.url = newRule.url;
        this.prefix = newRule.prefix;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

/* kJscsspPAGE_RULE */

function jscsspPageRule()
{
  this.type = kJscsspPAGE_RULE;
  this.parsedCssText = null;
  this.pageSelector = null;
  this.declarations = [];
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspPageRule.prototype = {
  cssText: function() {
    var rv = gTABS + "@page "
                   + (this.pageSelector ? this.pageSelector + " ": "")
                   + "{\n";
    var preservedGTABS = gTABS;
    gTABS += "  ";
    for (var i = 0; i < this.declarations.length; i++)
      rv += gTABS + this.declarations[i].cssText() + "\n";
    gTABS = preservedGTABS;
    return rv + gTABS + "}";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (token.isAtRule("@page")) {
      if (parser.parsePageRule(token, sheet)) {
        var newRule = sheet.cssRules[0];
        this.pageSelector = newRule.pageSelector;
        this.declarations = newRule.declarations;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

/* kJscsspSTYLE_RULE */

function jscsspStyleRule()
{
  this.type = kJscsspSTYLE_RULE;
  this.parsedCssText = null;
  this.declarations = []
  this.mSelectorText = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspStyleRule.prototype = {
  cssText: function() {
    var rv = gTABS + this.mSelectorText + " {";
    var preservedGTABS = gTABS;
    gTABS += "  ";
    for (var i = 0; i < this.declarations.length; i++) {
      var declText = this.declarations[i].cssText();
      if (declText)
        rv += gTABS + this.declarations[i].cssText() ;
    }
    gTABS = preservedGTABS;
    return rv + "\n" + gTABS + "}";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (!token.isNotNull()) {
      if (parser.parseStyleRule(token, sheet, false)) {
        var newRule = sheet.cssRules[0];
        this.mSelectorText = newRule.mSelectorText;
        this.declarations = newRule.declarations;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  },

  selectorText: function() {
    return this.mSelectorText;
  },

  setSelectorText: function(val) {
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (!token.isNotNull()) {
      var s = parser.parseSelector(token, true);
      if (s) {
        this.mSelectorText = s.selector;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

function jscsspStylesheet()
{
  this.cssRules = [];
  this.variables = {};
}

jscsspStylesheet.prototype = {
  insertRule: function(aRule, aIndex) {
    try {
     this.cssRules.splice(aIndex, 1, aRule);
    }
    catch(e) {
    }
  },

  deleteRule: function(aIndex) {
    try {
      this.cssRules.splice(aIndex);
    }
    catch(e) {
    }
  },

  cssText: function() {
    var rv = "";
    for (var i = 0; i < this.cssRules.length; i++)
      rv += this.cssRules[i].cssText() + "\n\n";
    return rv;
  }
};

var kJscsspINHERIT_VALUE = 0;
var kJscsspPRIMITIVE_VALUE = 1;
var kJscsspVARIABLE_VALUE = 4;

function jscsspVariable(aType, aSheet)
{
  this.value = "";
  this.type = aType;
  this.name  = null;
  this.parentRule = null;
  this.parentStyleSheet = aSheet;
}

jscsspVariable.prototype = {
  cssText: function() {
    if (this.type == kJscsspVARIABLE_VALUE)
      return this.resolveVariable(this.name, this.parentRule, this.parentStyleSheet);
    else
      return this.value;
  },

  setCssText: function(val) {
    if (this.type == kJscsspVARIABLE_VALUE)
      throw DOMException.SYNTAX_ERR;
    else
      this.value = val;
  },

  resolveVariable: function(aName, aRule, aSheet)
  {
    return "var(" + aName + ")";
  }
};

/* kJscsspVARIABLES_RULE */

function jscsspVariablesRule()
{
  this.type = kJscsspVARIABLES_RULE;
  this.parsedCssText = null;
  this.declarations = [];
  this.parentStyleSheet = null;
  this.parentRule = null;
  this.media = null;
}

jscsspVariablesRule.prototype = {
  cssText: function() {
    var rv = gTABS + "@variables " +
                     (this.media.length ? this.media.join(", ") + " " : "") +
                     "{\n";
    var preservedGTABS = gTABS;
    gTABS += "  ";
    for (var i = 0; i < this.declarations.length; i++)
      rv += gTABS + this.declarations[i].cssText() + "\n";
    gTABS = preservedGTABS;
    return rv + gTABS + "}";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (token.isAtRule("@variables")) {
      if (parser.parseVariablesRule(token, sheet)) {
        var newRule = sheet.cssRules[0];
        this.declarations = newRule.declarations;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

/* kJscsspWHITE_SPACE */

function jscsspWhitespace()
{
  this.type = kJscsspWHITE_SPACE;
  this.parsedCssText = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspWhitespace.prototype = {
  cssText: function() {
    return this.parsedCssText;
  }
};

var kJscsspUNKNOWN_RULE   = 0;
var kJscsspSTYLE_RULE     = 1
var kJscsspCHARSET_RULE   = 2;
var kJscsspIMPORT_RULE    = 3;
var kJscsspMEDIA_RULE     = 4;
var kJscsspFONT_FACE_RULE = 5;
var kJscsspPAGE_RULE      = 6;

var kJscsspKEYFRAMES_RULE = 7;
var kJscsspKEYFRAME_RULE  = 8;

var kJscsspNAMESPACE_RULE = 100;
var kJscsspCOMMENT        = 101;
var kJscsspWHITE_SPACE    = 102;

var kJscsspVARIABLES_RULE = 200;

var kJscsspSTYLE_DECLARATION = 1000;

var gTABS = "";
