const partnerId = "22053";
const secretKey = "30fce7745d0cac334fa761bea4d27c93";
const fifa = "22";
const myConsole = "ps";
const minBuy = 50000;

var dataSet = [];

function chainRequests() {
	var intervalId = window.setInterval(function(){
		makeRequest();
	}, 1000);
}

function makeRequest() {
  let timestamp = new Date().getTime();
  //console.log("timestamp==>",timestamp);
  let signature = md5(partnerId+secretKey+timestamp);
  //console.log("signature==>",signature);
  let endpoint = "https://dsfut.net/api/" + fifa + "/" + myConsole + "/" + partnerId + "/" + timestamp + "/" + signature+"?min_buy="+minBuy;
  //console.log("endpoint==>",endpoint);

  fetch(endpoint)
	.then(data => {
		return new Promise(function(resolve, reject) {
			setTimeout(function() {
			   resolve(data.json());
			}, 1000)
		 })
	})
	.then(function(result) {
		console.log(result.error);
		if(result.error !== "empty") {
			console.log(result);
			if(result.error === "") {
				createSound();
				appendToDatatable(result);
			}
		}
	});
}

function createSound() {
	var context = new AudioContext();
	var o = context.createOscillator();
	var  g = context.createGain();
	o.connect(g);
	g.connect(context.destination);
	o.start(0);
	g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 3);
}

function appendToDatatable(result) {
	let player = result.player;
	var t = $('#example').DataTable();
	t.row.add( [
		player.name,
		player.position,
		player.rating,
		player.startPrice,
		player.buyNowPrice,
		(parseInt(player.expires) / 3600).toFixed(2) + " Hours"
	] ).draw( false );
}

jQuery(function() {
    $('#example').DataTable( {
        data: dataSet,
        columns: [
            { title: "Player Name" },
            { title: "Position" },
			{ title: "Rating"},
            { title: "Start Price" },
            { title: "Buy Now Price" },
			{ title: "Expire In"}
        ]
    } );
	chainRequests();
} );