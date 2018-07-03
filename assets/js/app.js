<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>


<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment-with-locales.js"></script>
<script type="text/javascript">

var coordinates = ["26.1181345,-80.1382116"];
var startTime = ["2018-07-03T12:00:00.000Z"];
var endTime = ["2018-07-03T22:44:00.000Z"];
var pract = moment("2013-12-24 14:30").format()
console.log(pract);
//moment().toISOString() // 2013-02-04T22:44:30.652Z

function logPrices () {

var queryURL = "http://api.parkwhiz.com/v4/quotes/?q=coordinates:" + coordinates + "&start_time=" + startTime + "&end_time=" + endTime + "&distance=5&api_key=86c499549718c3f35aa39542839060bbc926217d";


$.ajax({
    url:queryURL,
    method: "GET"
})

.then(function(response) {

    console.log(queryURL);
    console.log(response);
    console.log(response[0].purchase_options[0].price);
    var max = 0;
    for (i=0; i<response.length; i++) {
        console.log(i,response[i].purchase_options[0].price.USD);
        var price = response[i].purchase_options[0].price.USD;
        if (price > max) {
            max = price;
        }
    }
    console.log("Max pricing = ", max);
});
};

logPrices();

</script>

</body>

</html>