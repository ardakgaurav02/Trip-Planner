// Student Name : Guarav Ardak
// Student ID : 1001969216
// College ID : gca9216

var tags = [];
function initialize () {
	max = 10
}

function sendRequest () {
	var xhr = new XMLHttpRequest();
	var search_query = encodeURI(document.getElementById("search").value);
	boundries = map.getBounds()
	cross_dist = google.maps.geometry.spherical.computeDistanceBetween(boundries.getNorthEast(), boundries.getCenter())
	xhr.open("GET", "proxy.php?term=" + search_query + "&limit=" + max + "&radius=" + parseInt(cross_dist) + "&latitude=" + boundries.getCenter().lat() + "&longitude=" + boundries.getCenter().lng());
	xhr.setRequestHeader("Accept","application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			var parse_data = JSON.parse(this.responseText);
			if(parse_data.hasOwnProperty("error")) document.getElementById("output").innerHTML = parse_data.error.code+"</br>"+parse_data.error.description;
			else{
				if(parse_data["businesses"].length==0) document.getElementById("output").innerHTML = "No results found";
				else{
                    for (var i = 0; i < tags.length; i++) {
                        tags[i].setMap(null);
                      }
                    tags = [];
                    for(var i=0;i<parse_data["businesses"].length;i++){
                        pos = new google.maps.LatLng({lat: parse_data["businesses"][i]["coordinates"]["latitude"], lng: parse_data["businesses"][i]["coordinates"]["longitude"]}); 
                        tags.push(new google.maps.Marker({position: pos, map: map, label: String(i+1)}));
                    }
                    final_result = "<table><tr><th>S.No.</th><th>Image</th><th>Name</th><th>Price</th><th>Rating</th><th>Postal Address</th><th>Phone</th><th>categories</th></tr>"
                    for(var i=0;i<parse_data["businesses"].length;i++){
                        final_result += "<tr><td>"
                        final_result += (i+1) + ".</td><td>"
                        final_result += "<img src=\"" + parse_data["businesses"][i]["image_url"] + "\" style=\"height:100px;width:100px;\"></td><td>"
                        final_result += "<a href=\"" + parse_data["businesses"][i]["url"] + "\">" + parse_data["businesses"][i]["name"] + "</a></td><td>"
                        final_result += parse_data["businesses"][i]["price"] + "</td><td>"
                        final_result += parse_data["businesses"][i]["rating"] + "</td><td>"
                        final_result += parse_data["businesses"][i]["location"]["display_address"] + "</td><td>"
                        final_result += parse_data["businesses"][i]["phone"] + "</td><td>"
                        for(var j=0;j<parse_data["businesses"][i]["categories"].length;j++){
                            final_result += parse_data["businesses"][i]["categories"][j]['title']
                        }
                        final_result += "</td></tr>"
                    }
                    final_result += "</table>"
                    document.getElementById("output").innerHTML = final_result;
				}
			}
		}
	};
	xhr.send(null);
}

function initMap(){
	center = {lat: 32.75, lng: -97.13} //Initially centered at this point given in the project
	map = new google.maps.Map(document.getElementById('map'), {
		center: center, 
		zoom: 16
	});
}
