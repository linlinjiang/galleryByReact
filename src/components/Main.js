require('normalize.css/normalize.css');
require('../styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//let yeomanImage = require('../images/yeoman.png');
//获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = ((imageDatasArr) => {
	for(var i=0,j=imageDatasArr.length;i<j;i++){
		var singleImageData = imageDatasArr[i];
		
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

//获取区间内的随机值
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

function getDegRandom(){
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random()*30));
}

class ImgFigure extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick(e) {

		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
      
		e.stopPropagation();
		e.preventDefault();
	}
	
	render(){
		var styleObj ={};
		//如果props属性中指定了这张图片的位置，则使用
		if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
     }
      //如果图片的旋转角度有值且不为0，添加旋转角度
      if(this.props.arrange.rotate){
      	(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(value) {
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
      }
      if(this.props.arrange.isCenter){
      	styleObj.zIndex = 11;
      }
      
      var imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return(
			<figure className = {imgFigureClassName} style = {styleObj} onClick = {this.handleClick}>
			<img src={this.props.data.imageURL} alt={this.props.data.title} />
			 <figcaption>
			<h2 className="img-title">{this.props.data.title}</h2>
			<div className = 'img-back' onClick = {this.handleClick}>
			<p>
			{this.props.data.desc}
			</p>
			</div>
			</figcaption>
			</figure>
		);
	}
}


class GalleryByReactApp extends React.Component {
	constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: { //水平方向的取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: { //垂直方向
        x: [0, 0],
        topY: [0, 0]
      }
    };
     this.state = {
      imgsArrangeArr: [
        //{
        //  pos:{
        //    left:'0',
        //    top:'0'
        //  },
        //    rotate:0, //旋转角度
        //isInverse:false //正反面
        //isCenter:false 图片是否居中
        //}
      ]
    };
     }
	/*翻转图片
	 * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
	 * @return {Function} 真正等待被执行的函数
	 */
	inverse(index){
		return function(){
			let imgArrangeArr = this.state.imgArrangeArr;
			imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
			this.setState({
				imgArrangeArr: imgArrangeArr
			});
		}.bind(this);
	}
	
	/*重新布局所有图片
	 * @param centerIndex 指定居中排布哪个图片
	 */
	rearrange(centerIndex) {
		let imgArrangeArr = this.state.imgsArrangeArr,
		    Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      //上侧图片的数值，可有可无。0或者1
      topImgNum = Math.floor(Math.random() * 2),//取一个或不取
      //上侧图片是从哪个位置拿出来的
      topImgSpliceIndex = 0,
      //中心图片的状态信息
      imgsArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);
    //居中 centerIndex
    imgsArrangeCenterArr[0] ={
      pos: centerPos,
      rotate : 0,
      isCenter: true
		   }
    
    //居中的 centerIndex 的图片不需要旋转
    imgsArrangeCenterArr[0].rotate = 0;
    
     //取出要布局上侧图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);
	
	//布局上侧图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos :{
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
       rotate:getRangeRandom(),
        isCenter: false
      }
    });
    
     //布局左右两侧的图片
    for (var i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null; //左区域或者右区域的取值范围

      //前半部分布局左边，右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgArrangeArr[i] ={
        pos : {
          top: getRangeRandom(hPosRange.y[0], hPosRange.y[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate:getDegRandom(),
        isCenter:false
      };
      }
    
    //把取出来的图片放回去
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgArrangeArr: imgArrangeArr
    });
   }
	
	/*
	 * 利用rearrange函数，居中对应index的图片
	 * @param index ，需要被居中的图片对应的图片信息
	 * @return {Function}
	 */
	center(index){
		return function() {
			this.rearrange(index);
		}.bind(this);
	}
	//组件加载以后，为每张图片加载其位置范围
	componentDidMount(){
		//拿到舞台大小
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
		   stageW = stageDOM.scrollWidth,
		   stageH = stageDOM.scrollHeight,
		   halfStageW = Math.ceil(stageW / 2),
		   halfStageH = Math.ceil(stageH / 2);
		
		   //拿到一个imageFigure的大小
		   let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
		       imgW = imgFigureDOM.scrollWidth,
		       imgH = imgFigureDOM.scrollHeight,
		       halfImgW = Math.ceil(imgW / 2),
		       halfImgH = Math.ceil(imgH / 2);
		       //计算中心图片的位置点
		       this.Constant.centerPos = {
		       	left: halfStageW - halfImgW,
		       	top: halfStageH - halfImgH
		       }
		       
		 
   //计算左右侧，图片位置取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    
    //计算上测区域图片排布的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    let num = Math.floor(Math.random() * 16);
    this.rearrange(num);
		       
	}
		
	render() {
		
		let controllerUnits = [],
		    imgFigures = [];
		    
		     imageDatas.forEach((value,index) => {
		     	if(!this.state.imgsArrangeArr[index]){
		     		this.state.imgsArrangeArr[index] = {
		     			pos:{
		     				left:0,
		     				top:0
		     			},
		     			rotate: 0,
		     			isInverse : false,
		     			isCenter: false
		     	}
		     }
		  
		 	imgFigures.push(<ImgFigure key={index} data={value} arrange={this.state.imgsArrangeArr[index]} ref = {'imgFigure'+index}  inverse = {this.inverse(index)} center = {this.center(index)} />);
      });
		 
		return (
			<section className = "stage" ref="stage">
			<section className = "img-sec">
			   {imgFigures}
			</section>
			<nav className = "controller-nav">
			{controllerUnits}
			</nav>
			</section>
		);
	}
}

GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;
