module.exports = {
    convertTime: function (duration) {

        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)) % 24);
   
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
   
        if (duration < 3600000) {
          return minutes + ":" + seconds ;
        } else {
          return hours + ":" + minutes + ":" + seconds ;
        }
    },
    convertNumber: function (number, decPlaces) {
       
        decPlaces = Math.pow(10,decPlaces);

        var abbrev = [ "K", "M", "B", "T" ];

      
       for (var i=abbrev.length-1; i>=0; i--) {

            var size = Math.pow(10,(i+1)*3);
          
            if(size <= number) {
                
                number = Math.round(number*decPlaces/size)/decPlaces;

               
                if((number == 1000) && (i < abbrev.length - 1)) {
                    number = 1;
                    i++;
                }

                number += abbrev[i];

                break;
            }
        }

        return number;
    },
    convertHmsToMs: function (hms) {
        if (hms.length < 3) {
            return hms = ((+a[0]) * 1000)
        } else if (hms.length < 6) {
            const a = hms.split(':')
            return hms = (((+a[0]) * 60 + (+a[1])) * 1000)
        } else {
            const a = hms.split(':')
            return hms = (((+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])) * 1000)
        }
    }
}