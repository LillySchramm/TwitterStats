const request = (req) => {
    return new Promise((resolve, reject) => {   
        let url = "http://api.eps-dev.de:42069/" + req;
        fetch(url, { mode: 'cors', headers: { 'Access-Control-Allow-Origin': '*' } }).then((response) => {            
            response.json().then((data) => {
                resolve(data)
            })            
        });        
    });
}

const getToplist = (type, n) => {
    return new Promise((resolve, reject) => {    
        request("top/" + n + "/" + type + "/now").then((ret) => {
            resolve(ret.top);
        })
    });
}

const getStats = () => {
    return new Promise((resolve, reject) => {    
        request("stats").then((ret) => {
            resolve(ret);
        })
    });
}

const getHistory = (type, n) =>{
    return new Promise((resolve, reject) => {    
        request("timeline/" + type + "/" + n).then((ret) => {
            resolve(ret);
        })
    });
}


String.prototype.hexEncode = function(){
    var hex, i;
  
    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
  
    return result
  }
  
String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

module.exports = {getToplist, getStats, getHistory}