- remove 'member' from empty members
- Refactor for mobile
- DONE. Custom Domain: LegislativeCommittees.org
- GitHub calendar-like resource for showing last updates
- Social media
- Google Analytics
- Handle subcommittees
- About page: Map showing status of each state
- implement site tour tool such as JoyRide
- Decide: separate site, or part of committee maps? If the latter: combine repos.
- Build Feedback forms (one for site, and one for member panel)
- use localStorage to redirect home page to users' favorite state.
- DONE. Why does null email print a blank line? check Handlebars registerHelper for possible issue
- DONE. state selector (dropdown and/or map)
- DONE. clear member detail upon selecting a new committee
- DONE. enable permalinks
- only display active members
- DONE. Determine why Maryland party is empty. UPDATE: per Sunlight Foundation, Maryland updates likely in February
- sort members for memberList, so that chairs are at the top.
- Modify SC "Vice-chair" to be "Vice-Chair"
- DONE. use url parameter to determine state
- research names, and use state url parameter and json file to determine the names for "House and Senate";
- DONE. alphabetize committees within dropdown
- split large committee lists into two or three columns?
- DONE. Do membership queries for each member, and attach results to the committee object.
- generate geojson files
- Leaflet
- figure out topojson?

- remove http://openstates.org/api/v1/legislators/FLL000016/?active=true&apikey=9e3e71730ae34e1ebbf4dd0e1c346c07 null
 content in handlebars
- ...resolve CORS issue
- resolve Florida House issue, searching for nulls

Farther along
- add subcommittees and permalinks
- Work with OpenStates -- maybe organize a hackathon -- to add social media data for legislators; Build tool for collecting Twitter and Facebook ids
