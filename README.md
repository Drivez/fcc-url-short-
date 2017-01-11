#API: URL Shortener

By Marius Kildedal

####User Stories:

* User Story: I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
* User Story: If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
* User Story: When I visit that shortened URL, it will redirect me to my original link.

###Example usage:
`https://fcc-url-short-drivez.herokuapp.com/new/http://www.vg.no`
###Example output:
`{ original_url: "http://www.vg.no", short_url: "fcc-url-short-drivez.herokuapp/comrJInODmUg" }`
