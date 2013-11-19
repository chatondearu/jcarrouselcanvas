/**
 *
 * no-detail
 *
 * <p>***</p>
 *
 * @name JcarrouselCanvas
 * @author Romain Lienard <me@rlienard.fr>
 * @http: 
 * @copyright (c)2012 Romain Lienard
 * @version 1.0.2
 * @package ***
 * @date: 14/02/12
 * @time: 13:27
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy of this
 *	software and associated documentation files (the "Software"), to deal in the Software
 *	without restriction, including without limitation the rights to use, copy, modify, merge,
 *	publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 *	to whom the Software is furnished to do so, subject to the following conditions:
 *
 * 	The above copyright notice and this permission notice shall be included in all copies
 *	or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 *	BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *	DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * 	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 *
 **/

function JcarrousselCanvas(idElem,images,options){

    var that = this,
        speed = 0,
        acceleration = 0.3,
        touch = ('ontouchstart' in window),
        START_EVENT = touch ? 'touchstart' : 'mousedown',
        MOVE_EVENT = touch ? 'touchmove' : 'mousemove',
        END_EVENT = touch ? 'touchend' : 'mouseup',
        o = {
            imgHeight : 0,
            imgWidth : 0,

            border : false,
            borderWidth : 3,
            borderColor : "#000000",

            reflect : true,
            reflectHeight : 0.5,
            reflectOpacity : 0.3,
            reflectDistance : 5,
            reflectBackgournd : '#ffffff',

            shadow : false,
            shadowDistance : 5,
            shadowWidth : 10,

            rayon : 200,
            hauteur : 30,
            verticalAlign : null,
            horizontalAlign : null,
            speedFrequence : 1000/30,
            startAngle : 90,
            stepAngle : null,

            perspective : 0.7,

            loose : true,
            step : true,
            setStep : true
        };
    this.imgs = (typeof(images) != "undefined" && images.constructor == Array)?
            images : new Array();
    this.eventInfo = {
        isDown : false,
        onMove : false,
        moving : false,
        startMove : {},
        endMove : {},
        startDown : {},
        endUp : {}
    };

    idElem = (typeof(idElem) != "undefined" && idElem.constructor == String && idElem != '')? idElem : 'carrousel';
	
    var canvas = document.getElementById(idElem);
    if(canvas.tagName != "CANVAS"){
        var c = document.createElement("canvas");
        c.id = idElem+'Canvas';
        c.height = canvas.offsetHeight;
        c.width = canvas.offsetWidth;
        canvas.appendChild(c);
        idElem = idElem+'Canvas';
    }
    canvas = document.getElementById(idElem);
    var context = ( canvas != null )? canvas.getContext("2d") : null ,
    // List of used methods for JcarousselCanvas
    methods = {
        extend : function(obj, extObj) {
            if (arguments.length > 2) {
                for (var a = 1; a < arguments.length; a++) {
                    methods.extend(obj, arguments[a]);
                }
            } else {
                for (var i in extObj) {
                    obj[i] = extObj[i];
                }
            }
            return obj;
        },
        toRad : function(deg){
            return Math.PI * deg /180;
        },
        getXformEllipse : function(rad){
            return o.horizontalAlign + ( o.rayon * Math.cos(rad));
        },
        getYformEllipse : function(rad){
            return o.verticalAlign + ( o.hauteur * Math.sin(rad));
        },
        getDegFromXY : function(x,y){
            var r = Math.atan(y/x)*180/Math.PI;
	        if(x<0)r+=180;
            return r;
        }
    };
    
    //set extend defaults options with options parameters
    if(typeof(options) != "undefined" && options.constructor == Object)
        o = methods.extend(o,options);
    if(o.stepAngle == null)
        o.stepAngle = 360 / that.imgs.length;
    if(o.horizontalAlign == null)
        o.horizontalAlign = canvas.width/2;
    if(o.verticalAlign == null)
        o.verticalAlign = canvas.height/2;
    
    // Variables
    this.actualAngle = 0;


    //Class Position
    function Position(x,y,z){
        this.x = (typeof(x) != "undefined")? x : 0 ;
        this.y = (typeof(y) != "undefined")? y : 0 ;
        this.z = (typeof(z) != "undefined")? z : 0 ;
    }

    //screen proprieties
    var screen = {
        //return the height of canvas
        height : function(){
            return canvas.height;
        },
        // return the width of canvas
        width : function(){
            return canvas.width;
        },
        //Clean all contexts in canvas element
        clean : function(){
            var canvas = document.getElementById(idElem);
            var context = ( canvas != null )? canvas.getContext("2d") : null ;
            context.clearRect(0, 0, canvas.width, canvas.height);
        },
        // Draw an Image in canvas element
        drawImg : function(img,x,y,w,h){
            var canvas = document.getElementById(idElem);
            var context = ( canvas != null )? canvas.getContext("2d") : null ;

            context.save();
            
            if(o.shadow || o.border){
                context.beginPath();
                context.rect(x-(w/2), y-(h/2), w, h);
                if(o.shadow){
                    context.shadowColor = o.borderColor;
                    context.shadowBlur = o.shadowWidth;
                    context.shadowOffsetY = o.shadowDistance;
                }
                context.fill();
                context.restore();

                context.save();
                if(o.border){
                    context.lineWidth = o.borderWidth * 2;
                    context.strokeStyle = o.borderColor;
                    context.stroke();
                }
            }
            
            //context.drawImage(image, dx, dy, dWidth, dHeight)
            context.drawImage(img, x-(w/2), y-(h/2), w, h);

            //Reflect Effect
            if(o.reflect){
                context.translate(x-(w/2), (y+(h*1.5)) + o.reflectDistance);

                context.scale(1, -1);
                context.globalAlpha = o.reflectOpacity;
                context.drawImage(img,0,0, w, h);
                context.globalAlpha = 1;

                var gradient = context.createLinearGradient(0,0,0,h * (1-o.reflectHeight) * 2);
                gradient.addColorStop(1, 'transparent');
                gradient.addColorStop(0.5, o.reflectBackgournd);
                context.fillStyle = gradient;
                context.fillRect(-1,-1, w+2, h+2);
            }

            context.restore();
        }
    },
    //Set All images to new position during moving or animation
    setPositionsImgs = function(){
        for(var index in that.imgs){
            var imgAngle = o.startAngle + that.actualAngle + (o.stepAngle * that.imgs[index].num);
            that.imgs[index].img.pos.x = methods.getXformEllipse(methods.toRad(imgAngle));
            that.imgs[index].img.pos.y = methods.getYformEllipse(methods.toRad(imgAngle));
        }
        that.imgs.sort(function(a,b){
            if(o.rayon >= o.hauteur)
                return a.img.pos.y - b.img.pos.y
            else
                return a.img.pos.x - b.img.pos.x
        });
    },
    //Load All images in Array to used and init them
    loader = function(callback){
        var loadedImages = 0;
        for(var index in that.imgs) {
            that.imgs[index].img = new Image();
            that.imgs[index].img.onload  = function(){
                if (++loadedImages >= that.imgs.length) {
                    callback();
                }
            };
            that.imgs[index].img.src = that.imgs[index].url;
        }
    },
	setImages = function(){
        var nbrImg = 0;
        for(var index in that.imgs){
            var imgAngle = o.startAngle + that.actualAngle + (o.stepAngle * nbrImg);
            if(typeof(that.imgs[index].id) == "undefined")
                that.imgs[index].id = index;
            if(typeof(that.imgs[index].callback) == "undefined")
                that.imgs[index].callback = function(id){};
            that.imgs[index].num = nbrImg;
            that.imgs[index].img.pos = new Position(
                methods.getXformEllipse(methods.toRad(imgAngle)),
                methods.getYformEllipse(methods.toRad(imgAngle)),
                0
            );
            nbrImg++;
        }
        that.imgs.sort(function(a,b){
            if(o.rayon >= o.hauteur)
                return a.img.pos.y - b.img.pos.y;
            else
                return a.img.pos.x - b.img.pos.x});
    },
	//Draw in Canvas all images
    drawCarroussel = function(){
        for(var index in that.imgs){
            /** /if(index != "contains"){/**/
                var img = that.imgs[index].img,
                x = img.pos.x,
                y = img.pos.y,
                h = (o.imgHeight == 0)?img.height:o.imgHeight,
                w = (o.imgWidth == 0)?img.width:o.imgWidth;
                if(o.perspective > 0){
                    var tauxy = ( y - (o.verticalAlign - o.hauteur)) / (o.hauteur*2);
                    var tauxx = ( x - (o.horizontalAlign - o.rayon)) / (o.rayon*2);
                    h = h * (((1-o.perspective) * tauxy)+o.perspective);
                    w = w * (((1-o.perspective) * tauxy)+o.perspective);
                }
                screen.drawImg(img,x,y, w,h);
            /** /}/**/
        }
    };

    var steps = {
        actualStep : function(){
            return Math.round( that.actualAngle / o.stepAngle );
        },
        stepAnimation : function(index){

            if(index == null)
                index = steps.actualStep();
            
            var imgAngle = (o.stepAngle * index);
            var distance = (imgAngle - that.actualAngle);
            if( distance > (acceleration*2) || distance < (-acceleration*2) ){
                that.actualAngle += (distance*acceleration);
                animation.start(index);
            }else{
                that.actualAngle = imgAngle;
                screen.clean();
                setPositionsImgs();
                drawCarroussel();
            }
        }
    },animation = {

        fq : o.speedFrequence,
        t : null,

        animate : function(index){
            if(o.loose)
                that.actualAngle += speed;
            that.actualAngle = that.actualAngle % 360;

            if(speed < 0)
                speed += acceleration ;
            else
                speed -= acceleration ;

            screen.clean();
            setPositionsImgs();
            drawCarroussel();

            if( (speed > acceleration || speed < -acceleration ) && o.loose)
                animation.start(index);
            else{
                if(o.step){
                    steps.stepAnimation(index);
                }
            }
        },

        start : function(index){
            animation.t = setTimeout(function(){
                animation.animate(index)
            },animation.fq);
        },

        stop : function(){
            clearTimeout(animation.t);
        }

    };
	this.setStep = function(index){
		animation.start(index);
	};

    //Get element as clicked and setStep of that to set callback linked
    var clickAction = function(){
        var sx = (canvas.offsetX)? that.eventInfo.startMove.x - canvas.offsetX : that.eventInfo.startMove.x - canvas.offsetLeft,
        sy = (canvas.offsetY)? that.eventInfo.startMove.y - canvas.offsetY : that.eventInfo.startMove.y - canvas.offsetTop,
        i = null,
        selected = null;

        for(var index in that.imgs){

            var img = that.imgs[index],
            x = img.img.pos.x,
            y = img.img.pos.y,
            h = (o.imgHeight == 0)?img.img.height:o.imgHeight,
            w = (o.imgWidth == 0)?img.img.width:o.imgWidth;
            if(o.perspective > 0){
                var tauxy = ( y - (o.verticalAlign - o.hauteur)) / (o.hauteur*2);
                var tauxx = ( x - (o.horizontalAlign - o.rayon)) / (o.rayon*2);
                h = h * (((1-o.perspective) * tauxy)+o.perspective);
                w = w * (((1-o.perspective) * tauxy)+o.perspective);
            }
            if( (x + (w/2)) > sx &&
                (x - (w/2)) < sx &&
                (y + (h/2)) > sy &&
                (y - (h/2)) < sy){
                i = that.imgs.length - img.num;
                selected = img;
            }

        }
        if(i != null){
            if(o.setStep && o.step)
                that.setStep(i);
            selected.callback(selected.id);
        }
    };

    var addEvent = function(){
        canvas.addEventListener(START_EVENT,function(e){
            e.returnValue = false;
            if (e.preventDefault) {
                e.preventDefault();
            }
            that.eventInfo.isDown = true;
            that.eventInfo.startMove = new Position(
                (touch)? e.touches[0].pageX || e.changedTouches[0].pageX : e.pageX,
                (touch)? e.touches[0].pageY || e.changedTouches[0].pageY : e.pageY,
                0
            );
            animation.stop();
            speed = 0;
        },false);
        canvas.addEventListener(MOVE_EVENT,function(e){
            if(that.eventInfo.isDown && !that.eventInfo.onMove){
                e.returnValue = false;
                if (e.preventDefault) {
                    e.preventDefault();
                }
                that.eventInfo.onMove = true;
                that.eventInfo.moving = true;

                that.eventInfo.endMove = new Position(
                    (touch)? e.touches[0].pageX || e.changedTouches[0].pageX : e.pageX,
                    (touch)? e.touches[0].pageY || e.changedTouches[0].pageY : e.pageY,
                    0
                );

                var sx = (canvas.offsetX)? that.eventInfo.startMove.x - canvas.offsetX : that.eventInfo.startMove.x - canvas.offsetLeft,
                sy = (canvas.offsetY)? that.eventInfo.startMove.y - canvas.offsetY : that.eventInfo.startMove.y - canvas.offsetTop,
                x = (canvas.offsetX)? that.eventInfo.endMove.x - canvas.offsetX : that.eventInfo.endMove.x - canvas.offsetLeft,
                y = (canvas.offsetX)? that.eventInfo.endMove.y - canvas.offsetY : that.eventInfo.endMove.y - canvas.offsetTop;
                
                screen.clean();
                setPositionsImgs();
                drawCarroussel();

                speed = ( methods.getDegFromXY(x,y) - methods.getDegFromXY(sx,sy) )*Math.PI ;

                that.actualAngle += speed;
                that.actualAngle = that.actualAngle % 360;

                that.eventInfo.startMove = new Position(
                    (touch)? e.touches[0].pageX || e.changedTouches[0].pageX : e.pageX,
                    (touch)? e.touches[0].pageY || e.changedTouches[0].pageY : e.pageY,
                    0
                );
                return that.eventInfo.onMove = false;
            }
        },false);
        canvas.addEventListener(END_EVENT,function(e){
            e.returnValue = false;
            if (e.preventDefault) {
                e.preventDefault();
            }
            that.eventInfo.isDown = false;
            
            if(!that.eventInfo.moving)
                clickAction();
            else
                animation.start(null);

            that.eventInfo.moving = false;
        },false);
    };

    //Initialisation of carroussel
    this.init = function(){
        screen.clean();
        setImages();
        drawCarroussel();
        addEvent();
    };

    loader(this.init);
}