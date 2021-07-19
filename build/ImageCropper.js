"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var image_editor_1 = __importDefault(require("@react-native-community/image-editor"));
var ImageViewer_1 = __importDefault(require("./ImageViewer"));
var percentCalculator_1 = require("./helpers/percentCalculator");
var window = react_native_1.Dimensions.get('window');
var w = window.width;
var defaultProps = {
    cropAreaWidth: w,
    cropAreaHeight: w,
    containerColor: 'black',
    areaColor: 'black',
    tileCircleColor:null,
    tileCircleRadious:null
};
var ImageCropper = /** @class */ (function (_super) {
    __extends(ImageCropper, _super);
    function ImageCropper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            positionX: 0,
            positionY: 0,
            width: 0,
            height: 0,
            scale: 1,
            minScale: 1,
            loading: true,
            srcSize: {
                width: 0,
                height: 0,
            },
            fittedSize: {
                width: 0,
                height: 0,
            },
            prevImageUri: '',
        };
        _this.init = function () {
            var imageUri = _this.props.imageUri;
            react_native_1.Image.getSize(imageUri, function (width, height) {
                var _a = _this.props, setCropperParams = _a.setCropperParams, cropAreaWidth = _a.cropAreaWidth, cropAreaHeight = _a.cropAreaHeight;
                var areaWidth = cropAreaWidth;
                var areaHeight = cropAreaHeight;
                var srcSize = { width: width, height: height };
                var fittedSize = { width: 0, height: 0 };
                var scale = 1;
                if (width > height) {
                    var ratio = w / height;
                    fittedSize.width = width * ratio;
                    fittedSize.height = w;
                }
                else if (width < height) {
                    var ratio = w / width;
                    fittedSize.width = w;
                    fittedSize.height = height * ratio;
                }
                else if (width === height) {
                    fittedSize.width = w;
                    fittedSize.height = w;
                }
                if (areaWidth < areaHeight || areaWidth === areaHeight) {
                    if (width < height) {
                        if (fittedSize.height < areaHeight) {
                            scale = Math.ceil((areaHeight / fittedSize.height) * 10) / 10;
                        }
                        else {
                            scale = Math.ceil((areaWidth / fittedSize.width) * 10) / 10;
                        }
                    }
                    else {
                        scale = Math.ceil((areaHeight / fittedSize.height) * 10) / 10;
                    }
                }
                scale =scale===0?1: scale;
                _this.setState(function (prevState) { return (__assign(__assign({}, prevState), { srcSize: srcSize,
                    fittedSize: fittedSize, minScale: scale, loading: false })); }, function () {
                    var _a = _this.state, positionX = _a.positionX, positionY = _a.positionY;
                    setCropperParams({
                        positionX: positionX,
                        positionY: positionY,
                        scale: scale,
                        srcSize: srcSize,
                        fittedSize: fittedSize,
                    });
                });
            }, function () { });
        };
        _this.handleMove = function (_a) {
            var positionX = _a.positionX, positionY = _a.positionY, scale = _a.scale;
            var setCropperParams = _this.props.setCropperParams;
            _this.setState(function (prevState) { return (__assign(__assign({}, prevState), { positionX: positionX,
                positionY: positionY,
                scale: scale })); }, function () {
                var _a = _this.state, srcSize = _a.srcSize, fittedSize = _a.fittedSize;
                setCropperParams({
                    positionX: positionX,
                    positionY: positionY,
                    scale: scale,
                    srcSize: srcSize,
                    fittedSize: fittedSize,
                });
            });
        };
        return _this;
    }
    ImageCropper.getDerivedStateFromProps = function (props, state) {
        if (props.imageUri !== state.prevImageUri) {
            return {
                prevImageUri: props.imageUri,
                loading: true,
            };
        }
        return null;
    };
    ImageCropper.prototype.componentDidMount = function () {
        this.init();
    };
    ImageCropper.prototype.componentDidUpdate = function (prevProps) {
        var imageUri = this.props.imageUri;
        if (imageUri && prevProps.imageUri !== imageUri) {
            this.init();
        }
    };
    ImageCropper.prototype.render = function () {
        var _a = this.state, loading = _a.loading, fittedSize = _a.fittedSize, minScale = _a.minScale;
        var _b = this.props, imageUri = _b.imageUri, cropAreaWidth = _b.cropAreaWidth, cropAreaHeight = _b.cropAreaHeight, containerColor = _b.containerColor, areaColor = _b.areaColor, areaOverlay = _b.areaOverlay,tileCircleColor=_b.tileCircleColor,tileCircleRadious=_b.tileCircleRadious;
        var areaWidth = cropAreaWidth;
        var areaHeight = cropAreaHeight;
        var imageWidth = fittedSize.width;
        var imageHeight = fittedSize.height;
        return (react_1.default.createElement(react_native_gesture_handler_1.GestureHandlerRootView, null, !loading ? (react_1.default.createElement(ImageViewer_1.default, { image: imageUri, areaWidth: areaWidth, areaHeight: areaHeight, imageWidth: imageWidth, imageHeight: imageHeight, minScale: minScale, onMove: this.handleMove, containerColor: containerColor, imageBackdropColor: areaColor,tileCircleColor:tileCircleColor,tileCircleRadious:tileCircleRadious, overlay: areaOverlay })) : null));
    };
    ImageCropper.crop = function (params) {
        var positionX = params.positionX, positionY = params.positionY, scale = params.scale, srcSize = params.srcSize, fittedSize = params.fittedSize, cropSize = params.cropSize, cropAreaSize = params.cropAreaSize, imageUri = params.imageUri;
        var offset = {
            x: 0,
            y: 0,
        };
        var cropAreaW = cropAreaSize ? cropAreaSize.width : w;
        var cropAreaH = cropAreaSize ? cropAreaSize.height : w;
        var wScale = cropAreaW / scale;
        var hScale = cropAreaH / scale;
        var percentCropperAreaW = percentCalculator_1.getPercentDiffNumberFromNumber(wScale, fittedSize.width);
        var percentRestW = 100 - percentCropperAreaW;
        var hiddenAreaW = percentCalculator_1.getPercentFromNumber(percentRestW, fittedSize.width);
        var percentCropperAreaH = percentCalculator_1.getPercentDiffNumberFromNumber(hScale, fittedSize.height);
        var percentRestH = 100 - percentCropperAreaH;
        var hiddenAreaH = percentCalculator_1.getPercentFromNumber(percentRestH, fittedSize.height);
        var x = hiddenAreaW / 2 - positionX;
        var y = hiddenAreaH / 2 - positionY;
        offset.x = x <= 0 ? 0 : x;
        offset.y = y <= 0 ? 0 : y;
        var srcPercentCropperAreaW = percentCalculator_1.getPercentDiffNumberFromNumber(offset.x, fittedSize.width);
        var srcPercentCropperAreaH = percentCalculator_1.getPercentDiffNumberFromNumber(offset.y, fittedSize.height);
        var offsetW = percentCalculator_1.getPercentFromNumber(srcPercentCropperAreaW, srcSize.width);
        var offsetH = percentCalculator_1.getPercentFromNumber(srcPercentCropperAreaH, srcSize.height);
        var sizeW = percentCalculator_1.getPercentFromNumber(percentCropperAreaW, srcSize.width);
        var sizeH = percentCalculator_1.getPercentFromNumber(percentCropperAreaH, srcSize.height);
        offset.x = Math.floor(offsetW);
        offset.y = Math.floor(offsetH);
        var cropData = {
            offset: offset,
            size: {
                width: Math.round(sizeW),
                height: Math.round(sizeH),
            },
            displaySize: {
                width: Math.round(cropSize.width),
                height: Math.round(cropSize.height),
            },
        };
        return new Promise(function (resolve, reject) {
            return image_editor_1.default.cropImage(imageUri, cropData).then(resolve).catch(reject);
        });
    };
    ImageCropper.defaultProps = defaultProps;
    return ImageCropper;
}(react_1.PureComponent));
exports.default = ImageCropper;
