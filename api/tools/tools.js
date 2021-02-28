function removeLeadingZero(s){
    let ret = ""
    let rem = []
    s.split(":").forEach((v) =>{
        if(v.startsWith("0")){
            v = v.substring(1);            
        }
        rem.push(v)
    })

    return rem[0] + ":" + rem[1] + ":" + rem[2] + "::" + rem[4];
}

function cleanSearch(s){
    return s.replace(";","").replace("-","").replace("?", "");
}

module.exports = {removeLeadingZero, cleanSearch};

