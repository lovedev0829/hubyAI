window.onload = getApplications;
function submitApp() {
  alert("Submit app functionality is yet to be built");
}
/*
function getApplications(vars){
	//this function helps retrieve the applications data added by Flask at the backend.
	alert(vars);
	return vars;
}
*/
function getApplications() {
	//this function  uses the data sent in html script in field appsData to build the table instead of making an async call from the front end.
	console.log("Applications in the new func:", data);
	dLocation = document.getElementById("div_dropdowns");
	console.log("div_dropdowns", div_dropdowns);
	//console.log("dLocation", dLocation);

	dLocation = document.getElementById("div_dropdowns");
	const div = document.createElement('div');
	const table = document.createElement('table');
	table.border = "1";
	const tr = document.createElement('tr');
	const td0 = document.createElement('td');
	const td1 = document.createElement('td');
	const td2 = document.createElement('td');
	td0.textContent = "Logo";
	tr.appendChild(td0);
	td1.textContent = "Name";
	tr.appendChild(td1);
	td2.textContent = "Description";
	tr.appendChild(td2);
	table.appendChild(tr);
	console.log("data received is: ", appsData);
	//const jAppsData = JSON.parse(appsData); //already json
	//console.log("Parsed data received is: ", jAppsData);
	for (const row of appsData) {
		//console.log("row:", row);
		const tableRow = document.createElement('tr');
		const rowCell0 = document.createElement('td');
		const logo = document.createElement('img');
		const rowCell1 = document.createElement('td');
		const rowCell2 = document.createElement('td');
		logo.src = row["product_logo_url"];
		rowCell0.appendChild(logo);
		rowCell1.textContent = row["application"];
		rowCell2.textContent = row["description"];
		tableRow.appendChild(rowCell0);
		tableRow.appendChild(rowCell1);
		tableRow.appendChild(rowCell2);
		table.appendChild(tableRow);
	}
	div.appendChild(table);
	dLocation.insertAdjacentElement('afterend', div);
}

function getApplications2() {
	//this function generates the apps table by calling the API from the client.
	url = "http://172.233.128.193:5000/applications";
	method = "GET";
	headers = "";
	data = "";
	console.log("Starting the fetch of data");
	fetchAPI(url, method, headers, data).then( (applications => {
		console.log("Applications:", applications);
		dLocation = document.getElementById("div_dropdowns");
		console.log("div_dropdowns", div_dropdowns);
		console.log("dLocation", dLocation);

		dLocation = document.getElementById("div_dropdowns");
		const div = document.createElement('div');
		const table = document.createElement('table');
		table.border = "1";
		const tr = document.createElement('tr');
		const td0 = document.createElement('td');
		const td1 = document.createElement('td');
		const td2 = document.createElement('td');
		td0.textContent = "Logo";
		td1.textContent = "Name";
		tr.appendChild(td1);
		td2.textContent = "Description";
		tr.appendChild(td2);
		table.appendChild(tr);
		for (const row of applications) {
			const tableRow = document.createElement('tr');
			const rowCell0 = document.createElement('td');
			const logo = document.createElement('img');
			const rowCell1 = document.createElement('td');
			const rowCell2 = document.createElement('td');
			logo.src = row["product_logo_url"] ;
			rowCell0.appendChild(logo);
			rowCell1.textContent = row["application"];
			rowCell2.textContent = row["description"];
			tableRow.appendChild(rowCell0);
			tableRow.appendChild(rowCell1);
			tableRow.appendChild(rowCell2);
			table.appendChild(tableRow);

		}

    		div.appendChild(table);
    		dLocation.insertAdjacentElement("afterend", div);
  	});
  });
}

function createTable(applications) {
  return `<table>
		  <thead>
		    <tr>
		      <td>Application</td>
		      <td>Description</td>
		    </tr>
		  </thead>
		  <tbody>
		  </tbody>
		</table>
	`;
}

async function fetchAPI(url, method, headers, data) {
  console.log("url is: ", url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("API call did not succeed.");
  }
  const results = await response.json();
  console.log("got the callback response:", results);
  return results;
}
/*
function fetchAPI(url, method, headers, data) {
	return fetch(url, {
        headers: headers,
        body: JSON.stringify(data),
        method: method
    }).then (result=> {
        if (!result.ok){
            throw new Error('API call did not succeed.');
        }
	console.log("got the callback response:", result.json());
        return result.json();
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
}
*/
