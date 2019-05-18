var animation;
var cancelScreen=false;
var full_page="true";
var specialSettings=false;
var strParams="&full_page=true&width=1200&response_type=image";
var currentNameWebsite;
var currentStep=0;
var haveParams=false;
var timerOut;
var contResponse=0;
var timeLimitWait=120; // two minutes
var modelDevice;
var platformDevice;
var uuidDevice="internetespoder.com";
var versionDevice;
var APPID;
var hits;
var plan;

var exitApp = false, intval = setInterval(function (){exitApp = false;}, 1000);
    function shareScreenshot(){
      var currentImageBase64=$("#responseImage").attr("src");
      window.plugins.socialsharing.share(null, 'Your Image', currentImageBase64, null);
    }

    document.addEventListener("backbutton", onBackKeyDown, false);
    function defaultValues(){
        $("#width").val("1200");
        $("#wait").val("0");
        $("#height").val("0");
        $("#sQuality option:selected").val(80);
        $("#headers").val("");
        $("#cookies").val("");
        specialSettings=false;
        strParams="&full_page=true&width=1200&response_type=image";
        $("#withChanges").css("display", "none");
    }
    function saveSettings(){
      width=$("#width").val();
      wait=$("#wait").val();
      height=$("#height").val();
      quality=$("#sQuality option:selected").val();
      headers=encodeURIComponent( $("#headers").val());
      cookies=encodeURIComponent($("#cookies").val());
      var str1="";
      var str2="";
      if(height=="0"){
         full_page="true";
      }else{
        specialSettings=true;
           full_page="false";
      }

      if($.trim(headers)!=''){
        exp=$.trim(headers).split(";");
        if(exp.length){
          cont=0;
          str1="";
          for(var i=0;i < exp.length; i++){
              c=exp[i];
              if(c!=''){
                str1=str1+c+";";
              }
          }

        }
          specialSettings=true;
      }

      if($.trim(cookies)!=''){
        exp2=$.trim(cookies).split(";");
        if(exp2.length){
          cont2=0;
          str2="";
          for(var i=0;i < exp2.length; i++){
              c=exp2[i];
              if(c!=''){
                str2=str2+c+";";
              }
          }

        }
          specialSettings=true;

      }

      if(specialSettings){
        $("#withChanges").fadeIn();
          strParams="&height="+height+"&width="+width+"&full_page="+full_page+"&delay="+wait+"&quality="+quality+"&headers="+str1+"&cookies="+str2+"&response_type=image";
      }
      step(1);
    }

    function onBackKeyDown() {
      if (exitApp) {
            clearInterval(intval) 
            (navigator.app && navigator.app.exitApp()) || (device && device.exitApp())  
        }
        else {
            exitApp = true
        } 
        if($("#upgradeFade").css("display") != "none" ){
          $("#upgradeFade").css("display" , "none");
          return;
        }
      if(currentStep==0 || currentStep==1) {step(0); return;}
      if(currentStep==3) {step(0); defaultValues(); return; }
      if(currentStep==4) {step(1); return;}
      if(currentStep ==2){  contResponse=0;   clearInterval(timerOut); cancelScreen=true;     step(0);       return;    }

    }
    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    function emptyStep(){
        $("#firstStep").css("display","none");
        $("#secondStep").css("display","none");
        $("#fetching").css("display","none");
        $("#thirdStep").css("display","none");
        $("#fourStep").css("display","none");
    }

    function step(id){
      currentStep=id; emptyStep();
       if(id==0)    $("#firstStep").fadeIn();
        if(id==1){
          responsiveElements();
            var protocol; var domainOutProtocol;
            domain=$("#domain").val();
            searchProtocol=domain.indexOf("://");
            (searchProtocol != -1 )? domainOutProtocol=domain.substring( searchProtocol+3 ) : domainOutProtocol=domain;
            (searchProtocol != -1 )? protocol=domain.substring(0,searchProtocol+3 ) : protocol="http://";
            splitDomain=domainOutProtocol.split("/");
            theDomain=splitDomain[0];
            currentNameWebsite=protocol+domainOutProtocol;
            if(validURL(theDomain)!=false){
                $("#firstStep").fadeOut();
                $("#secondStep").fadeIn();
                (currentNameWebsite.length > 30) ? $("#nameWebsite").html("<a title='"+currentNameWebsite+"'  onclick=\"alert('"+currentNameWebsite+"');\">"+currentNameWebsite.substring(0,30)+"..</a>")                : $("#nameWebsite").html(currentNameWebsite);
            }else{
                alert("Please write a correct name of website");
                $("#firstStep").fadeIn();
            }
        }

        if(id==2){
          clearInterval(timerOut);
          currentHits=$("#globalShots").attr("hits");
              if(currentHits-1 <0 ){
                $("#globalShots").html(0);
                $(".globalShots").html(0);
                    step(0);
                    anima(2)
                    return;
              }

            $("#fetching").fadeIn();
            $("#responseImage").attr("src","");
            $("#responseImage").css("display","none");
            timerOut= setInterval(function(){
              validateResponse();
            },1000);

            $.post("https://internetespoder.com/apps/easyscreenshotswebsite/cdn/core.php",{site:currentNameWebsite, params:strParams,APPID:APPID}).done(function(data){

              if($.trim(data)=='{"error" : "ERR_NAME_NOT_RESOLVED"}'){
                cancelScreen=true;
                step(0);
                alert("Sorry we detected one error with this website");
                  cancelScreen=false; contResponse=0;   clearInterval(timerOut);
                return;
              }
              currentHits=$("#globalShots").attr("hits");
              if(currentHits-1 <=0 ){
                alert("force to upgrade");
              }
              
              $("#globalShots").attr("hits",currentHits-1);
              $("#globalShots").html(currentHits-1);
              $(".globalShots").html(currentHits-1);
              anima(2);
             
              dataImage=data;
                  $("#responseImage").attr("src",data);
                  setTimeout(function(){
                  if(!cancelScreen)    {
                      step(3);         endAnimation();
                      $("#responseImage").fadeIn();
                      addBase64ToSQL();           contResponse=0;   clearInterval(timerOut);
                      }else{
                          cancelScreen=false;
                      }
                    },3000);
                });
                }

        if(id==3)      $("#thirdStep").fadeIn();
        
        if(id==4)       $("#fourStep").fadeIn();;
        
    }
    
    function validateResponse(){
      contResponse++;
      if(contResponse>=timeLimitWait){
        cancelScreen=true;
        step(0);
        contResponse=0;   clearInterval(timerOut);
        alert("Sorry this site it takes too long");
      }
    }
    function logoIn(){
        $(".fadeinLogo").animate({opacity:1},800,"linear",function(){
            logoOut();
        });
    }
    function logoOut(){      $(".fadeinLogo").animate({opacity:0.8},200,"linear");    }
      var intervalLoading;
    

    function endAnimation(){
      clearInterval(intervalLoading);
        $(".fadeinLogo").animate({opacity:0.8},200,"linear");
    }

    startAnimation();
            setTimeout(function(){
                $("#loadingPage").fadeOut();
                $("#contentStep").fadeIn();
                step(0);
                endAnimation();
            },2000);

            var dataImage="";
            function saveFile(){
              var data = dataImage;
              nowTime2=Date.now();
              var fileName="Download/"+nowTime2 + ".jpg";
              var myBaseString = dataImage;
              var block = myBaseString.split(";");
              var dataType = block[0].split(":")[1];
              var realData = block[1].split(",")[1];

              window.resolveLocalFileSystemURL( cordova.file.externalRootDirectory, function( directoryEntry ) {
                  directoryEntry.getFile(fileName, { create: true }, function( fileEntry ) {
                      fileEntry.createWriter( function( fileWriter ) {
                          fileWriter.onwriteend = function( result ) {
                             
                             var localFile=cordova.file.externalRootDirectory+"/"+fileName;
                            window.cordova.plugins.FileOpener.canOpenFile(localFile, function(data){
                                if(data.canBeOpen==true){
                                     window.cordova.plugins.FileOpener.openFile(localFile, function(){
       
                                    }, onError);
                                    }
                            }, onError);
                          };
                          fileWriter.onerror = function( error ) {
                              console.log( error );
                              alert(error);
                          };
                          fileWriter.write( b64toBlob(realData,dataType) );
                      }, function( error ) { alert(error); } );
                  }, function( error ) { alert(error); } );
              }, function( error ) { alert(error); } );
            }

            var onSuccess = function(data) { };
            function onError(error) {      alert('message: '  + error.message);       }

    function addBase64ToSQL(){
        var db=window.openDatabase("easyDB", "2.0", "Test DB", 1000000);
        console.log(db);
        nowTime=Date.now();

        db.transaction(function (tx) {
        tx.executeSql("INSERT INTO images VALUES('"+dataImage+"', '"+currentNameWebsite+"', '"+nowTime+"')");
        }, errorCB, successCB);

    }


    function toDataURL(url, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onload = function() {
            var fileReader = new FileReader();
            fileReader.onloadend = function() {
                callback(fileReader.result);
            }
             fileReader.readAsDataURL(httpRequest.response);
        };
        httpRequest.open('GET', url);
        httpRequest.responseType = 'blob';
        httpRequest.send();
    }

    function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, {type: contentType});

            return blob;
    }

        function startAnimation(){
            document.addEventListener("deviceready", function(){
                modelDevice = device.model ;
                platformDevice=device.platform;
                uuidDevice=device.uuid;
                versionDevice=device.version;
                (!uuidDevice)? uuidDevice="internetespoder.com": i=1;
                responsiveElements();
                $.post("https://internetespoder.com/apps/easyscreenshotswebsite/cdn/ping.php",{model:modelDevice,uuid:uuidDevice,platform:platformDevice,version:versionDevice}).done(function(data){
          
                    obj=$.parseJSON(data);
                    APPID=obj.md5;
                    hits=obj.hits;
                    plan=parseInt(obj.plan);
                    email=obj.email;
                    if(plan>2) $("#titlePlan").html("Pro"); else $("#titlePlan").html("Free"); 
                    if(plan==2 || plan==3 ){
                        $("#plus90").remove();  $("#plus90Title").remove(); $("#firstPlan").css("margin-top", "20px"); 
                        $("#textByPlan").html("You need more images?<br>Go to plans <br>");
                        if(email=='' || email=='1') email="Dear User";
                        $("#userSection").html("Hi " + email + "<br> <a target='_blank' href='https://internetespoder.com/apps/easyscreenshotswebsite/cdn/history.php?code="+APPID+"'> Check your history </a> <br> ");
                    }
                    if(plan==4){
                        $("#plus90Title").remove();
                        $("#firstPlan").css("margin-top", "20px"); 
                        $("#textByPlan").html("You need more images?<br>Go to plans <br>");
                        if(email=='' || email=='1') email="Dear User";
                        $("#userSection").html("Hi " + email + "<br> <a target='_blank' href='https://internetespoder.com/apps/easyscreenshotswebsite/cdn/history.php?code="+APPID+"'> Check your history <br></a>  <br> API KEY: "+APPID+"<br><a target='_blank' href='https://internetespoder.com/apps/easyscreenshotswebsite/cdn/cdk.php?code="+APPID+"'> CDK documentation </a> <br><br>" );
                    }

                    if(plan==1)  $("#textByPlan").html("Get Free +50 Images <br><br>");
                    $("#globalShots").html(hits);  $(".globalShots").html(hits);    $("#globalShots").attr("hits",hits);
                    if(hits<=0) { $("#globalShots").html(0);   $(".globalShots").html(0); }
                });

                intervalLoading=setInterval(function(){ logoIn(); },1200);
            }, false);     
        }

       
    onDeviceReady();
    function onDeviceReady() {

        var db = window.openDatabase("easyDB", "2.0", "Test DB", 1000000);
        if(uuidDevice!="internetespoder.com"){
            modelDevice = device.model ;
            platformDevice=device.platform;
            uuidDevice=device.uuid;
            version=device.version;
        }
        db.transaction(function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS images');
            tx.executeSql('CREATE TABLE IF NOT EXISTS images (base64Image text, website text, time_in text)');
        }, errorCB, successCB);

    }
    function errorCB(e){                    console.log(e);            }
    function successCB(){}

    function responsiveElements(){
        setTimeout(function(){
            var w = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
            var h = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
            (w > 500)? wdth="90%": wdth="90%";     $(".responsive").css("width", wdth);
            (h < 400) ? hght="100": hght="200";  $(".responsiveLogos").attr("width", hght);
            (w > 500)? wdth="100%": wdth="90%";     $("#domain").css("width", wdth);
        },1000)
    }

    window.addEventListener("orientationchange", function(){ console.log(screen.orientation.type);responsiveElements(); });
    window.addEventListener("onresize", function(){ responsiveElements(); });
    $( document ).ready(function() {            $("body").fadeIn();         });
    function animateCSS(element, animationName, callback) {
        const node = document.querySelector(element)
        node.classList.add('animated', animationName)
        function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
        }
        node.addEventListener('animationend', handleAnimationEnd)
    }

    function anima(priority){
      clearInterval(animation);
      
      if(priority==1){
        animateCSS('#theIcon', 'fadeIn', function() {
        animation=setTimeout(function(){
          $("#theIcon").css("display","none");
          $("#contShots").fadeIn();
          animateCSS('#contShots', 'swing', function() {
            animation= setTimeout(function(){
              $("#contShots").css("display","none");
              $("#upgrade").fadeIn();
              animateCSS('#upgrade', 'rubberBand', function() {
                animation=setTimeout(function(){
                  anima(1);
                  $("#upgrade").css("display","none");
                  $("#theIcon").fadeIn();
                },5000);
              });
            },5000);
          });
        },5000);

      });
      }

    if(priority==2){
            clearInterval(animation);
            $("#theIcon").css("display" , "none");
            $("#upgrade").css("display", "none");
            $("#contShots").css("display", "block");
            animation=setTimeout(function(){
                $("#contShots").fadeIn();
                animateCSS('#contShots', 'zoomIn', function() {
                animation=  setTimeout(function(){
                    $("#contShots").css("display","none");
                    $("#upgrade").fadeIn();
                    animateCSS('#upgrade', 'rubberBand', function() {
                    animation= setTimeout(function(){
                        anima(1);
                        $("#upgrade").css("display","none");
                        $("#theIcon").fadeIn();
                    },5000);
                    });
                },5000);
                });
            });

        }


    }

function upgradeShow(){   $("#upgradeFade").fadeIn(); }
 
function upgrade(id){
     if(id==1){
          email=$.trim($("#emailUpgrade").val());
          if(validateEmail(email)){
            $("#lGFree").css("display", "none");
            $("#rBuy0").fadeIn();
             $.post("https://internetespoder.com/apps/easyscreenshotswebsite/cdn/upgrade.php",{
                APPID:APPID, 
                email:email,
                plan:"FREE 90"
                }).done(function(data){
                    alert(data);
                    $("#lGFree").fadeIn();
                    $("#rBuy0").css("display", "none");
                    location.reload(); 
                 });
         }else{
                alert("Please write a valid email");
        }
    
     }
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function payment(plan){
        if(plan==3){
            $("#amount").val("1.00");
            $("#item_name").val("+100 Images Product");
            $("#buy1").css("display","none");
            $("#rBuy1").fadeIn();
        }

        if(plan==4){
            $("#amount").val("5.00");
            $("#item_name").val("+500 Images Product");
            $("#buy2").css("display","none");
            $("#rBuy2").fadeIn();
        }

        $.post("https://internetespoder.com/apps/easyscreenshotswebsite/cdn/requestPayment.php?appid="+APPID+"&plan="+plan).done(function(data){
            obj=$.parseJSON(data);
            response=obj.response;
            message=obj.message;
            if(response=="false"){
                alert(message);
                $("#rBuy1").css("display","none");
                $("#rBuy2").css("display","none");
                $("#buy1").css("display","inline-block");
                $("#buy2").css("display","inline-block");
            }else{
                $("#trueProcess").attr("value", "https://internetespoder.com/apps/easyscreenshotswebsite/cdn/paypal.php?status=true&code="+message);
            $("#falseProcess").attr("value", "https://internetespoder.com/apps/easyscreenshotswebsite/cdn/paypal.php?code="+message);
                setTimeout(function(){
                    $("#btnPaypal").click();
                    $("#rBuy1").css("display","none");
                    $("#rBuy2").css("display","none");
                    $("#buy1").css("display","inline-block");
                    $("#buy2").css("display","inline-block");
                },2000);
            }
        });
    }
    anima(1);
      