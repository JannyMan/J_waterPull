function J_waterPull(imgsArr,option ) {
    var J_waterPull = $('.J-waterPull');
    // 创建容器对象，存放img图片
    var waterPull = {
        "width": 0,         /*容器的宽度*/
        "height": 0,        /*容器的高度*/
        "imgW":0,           /*图片的宽度*/
        "imgH":0,
        "picPd": "10px",         /*图片父级盒子的内边距值*/
        "picSolid": 0,    /*图片父级盒子的边框值*/
        "liPd": [ 30, 10, 100, 10],        /*图片父级的父级的盒子的内边距值*/
        // "liMg": [ 10, 5, 15, 20],        /*图片父级的父级的盒子的外边距值*/
        "liSolid": 1,     /*图片父级的父级的盒子的边框值*/
        "prePic":40,    //预先加载图片个数
        "boxAlign":"center"    //默认居中
    };
    //创建图片对象
    var imgArr=[
        {"id":null, "url":"", "title":"", "about":""}
        ];
   /* 使用继承的方式获取数据和初始化数据 json继承  数组为替换方式*/
    var newObj = jQuery.extend(waterPull, option || {});
    var newImgArr = jQuery.extend(imgArr, imgsArr || []);

    //动态创建外节点
    createEl();
    function createEl() {
        $('.J-waterPull').append(
            '<div class="main">' +
            '<div class="pic">' +
            '<ul data-liw="'+newObj["width"]+'">' +
            '</ul>'
        );
        $('.J-waterPull > .main > ul').addClass('wpBase');

        //遍历图片数组，动态添加节点和图片
        $(newImgArr).each(function (index) {
            if((index+1) > newObj["prePic"]) return;
            var url=newImgArr[index]["url"];
            $('.J-waterPull > .main >.pic > ul').append('<li>' +'<span>'+
                /*'<h2>上标题</h2>'+*/
                '<img src="'+url+'">' +
                /*'<h2>下标题</h2>'+*/
                '</span>'+
                '</li>');
        });
    }

    //使用jQuery获取屏幕的宽度$(window).width()
    //var screenWidth = $(window).width();
    //console.log(screenWidth);

    //居中显示
    /*
    * 获取父盒子的宽度
    * 计算列数
    * 计算容器的宽度
    * 居中显示
    * */
    //获取图片的宽度
    var boxWidth =J_waterPull.parent().width();
    var picWidth =parseInt(J_waterPull.attr('data-picW'));
    //console.log(boxWidth, picWidth);

    //获取宽度   li的officeWidth
    /*console.log('li的宽度是：'+$('li').eq(0).get(0).offsetWidth);
    console.log('li的宽度是：'+$('li').eq(0).width());*/

    //设置li的边距
    /*console.log(waterPull["liPd"]);*/
    if(newObj["liPd"].length == 4){
        $('li').css({
            "padding":newObj["liPd"][0]+"px"+" "+newObj["liPd"][1]+"px"+" "+newObj["liPd"][2]+"px"+" "+newObj["liPd"][3]+"px"
        });
    }
    /*var picWidth =parseInt(J_waterPull.attr('data-picW'));*/
    // 计算一个li的宽度    picWidth + waterPull["liPd"][1] + waterPull["liPd"][3]
    var liWidth = picWidth + newObj["liPd"][1] + newObj["liPd"][3] + 2*newObj["liSolid"];
    //console.log("liWidth:"+ liWidth);
    //计算列数
    var columns = parseInt(boxWidth/liWidth);
    //console.log(columns);
    //居中显示
    //判断是否要居中   "boxAlign":"center"
    if(newObj["boxAlign"] == "center"){
        var waterPullW = columns * liWidth;
        J_waterPull.css({
            "width": (waterPullW + "px"),
            "margin":"0 auto"
        });
    }
    var n=0;
    var heightArr=[];    //整个高度的数组
    var leftArr=[];        //左边的距离
    var colArr=[];      //第一行高度的数组
    var oli = $('.J-waterPull > .main > .pic > ul > li');
    $("img").bind("load", function () {
        console.log("-----------");
        /*var  c = $ ('.J-waterPull > .main > .pic > ul > li').height();*/
        n++;
        if(n>=newObj["prePic"]) {
            //console.log(n);
            //定义高度数组
            for(var i=0; i<n; i++){
                var y = (oli)[i].offsetHeight;
                heightArr.push(y);
                //console.log(i+"x:"+x+" "+"height:"+y);
            }
            for(var j = 0; j<heightArr.length; j++){
                if(j<columns) {
                    var z;
                     z = heightArr[j];
                    colArr.push(z);
                    //console.log(colArr[j], heightArr[j]);
                    var x = (oli)[j].offsetLeft;
                    leftArr.push(x);
                }else {
                    //获取高度数组最小值
                    var min= minNum(colArr);
                    //console.log("数组的最小值是："+min);
                    //返回这个数组的值的index
                    var index = arrIndex(colArr, min);
                    //console.log("数组的最小值下标："+ index);
                    //定位图片到这个图片的下面
                    $((oli)[j]).css({
                        "position": "absolute",
                        "left":leftArr[index] + "px",
                        "top":min + "px"
                    });
                    //console.log($(oli[j]).css("background","red"));
                    //更新数组
                    var sumH = min + heightArr[j];
                    //console.log(sumH);
                    colArr[index] = sumH;
                }
            }
        }
    });

    //获取图片的宽度
    /*判断是否用户给定宽度
     有：获取用户给定的宽度  data-liw
     没有：使用系统获取的宽度*/

    /*图片与main的padding值
     * 名：J-padding 使用继承的方式获取值
     * 布局
     * */
    //获取数组的最小值
    //var numArr = [151,1611,511,201,10011];
    //console.log(minNum(numArr));
    function minNum(numArr) {
        var min;
       for(var i=0;i<numArr.length;i++){
           if(i==0){
               min = numArr[0];
           }else {
               min=Math.min(min, numArr[i]);
           }
       }
        return min;
    }
    //获取给定数组的下标
    function arrIndex(arr, val) {
        for(var i = 0;i<arr.length;i++){
            if(arr[i] == val){
                return i;
            }
        }
    }
}