var socket = new WebSocket("ws://127.0.0.1:1337");
var hold1 = false;
var hold2 = true;

$(function () {
	socket.onopen = function() {
		document.getElementById('server_state').innerHTML = 'online';
  	}

  	socket.onclose = function() {
		document.getElementById('server_state').innerHTML = 'closed';
  	}

  	socket.onerror = function() {
  		document.getElementById('server_state').innerHTML = 'failed';
  	}
 
	socket.onmessage = function(result) {
		var data_str = result.data;

	    var rgx_s1 = /S1:(\d+.\d+);/g;
	    var rgx_s2 = /S2:(\d+.\d+);/g;
	    var match_s1 = rgx_s1.exec(data_str);
	    var match_s2 = rgx_s2.exec(data_str);

	    if ( match_s1 && match_s1[1] ) {
	    	data.s1 = !hold1 || parseFloat(match_s1[1]) != 0 ? parseFloat(match_s1[1]) : data.s1;
	        document.getElementById('sensor_a_value').innerHTML = data.s1;
	    }
	    if ( match_s2 && match_s2[1] ) {
	    	data.s2 = !hold2 || parseFloat(match_s2[1]) != 0 ? parseFloat(match_s2[1]) : data.s2;
	        document.getElementById('sensor_b_value').innerHTML = data.s2;
	    }
  	}
});

function setHold(e) {
	hold1 = e.target.checked;
}