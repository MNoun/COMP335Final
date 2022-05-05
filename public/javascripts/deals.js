let xhttp = new XMLHttpRequest();

xhttp.addEventListener("load",success);
xhttp.addEventListener("error",error);

let btn = document.getElementById("clearButton");

function chkDeals(){

  var productMenu = document.getElementById('products');
  var productValue = productMenu.options[productMenu.selectedIndex].value;

  var areaMenu = document.getElementById('location');
  var areaValue = areaMenu.options[areaMenu.selectedIndex].value;

  if(productValue == "beverage"){
    if(areaValue == "02324"){
      xhttp.open("GET", "/bev1Out", true);
      xhttp.send();
    }
    if(areaValue == "02382"){
      xhttp.open("GET", "/bev2Out", true);
      xhttp.send();
    }
  }

  if(productValue == "snack"){
    if(areaValue == "02324"){
      xhttp.open("GET", "/snack1Out", true);
      xhttp.send();
    }
    if(areaValue == "02382"){
      xhttp.open("GET", "/snack2Out", true);
      xhttp.send();
    }  
  }

  if(productValue == "bread"){
    if(areaValue == "02324"){
      xhttp.open("GET", "/bread1Out", true);
      xhttp.send();
    }
    if(areaValue == "02382"){
      xhttp.open("GET", "/bread2Out", true);
      xhttp.send();
    }
  }

  if(productValue == "meat"){
    if(areaValue == "02324"){
      xhttp.open("GET", "/meat1Out", true);
      xhttp.send();
    }
    if(areaValue == "02382"){
      xhttp.open("GET", "/meat2Out", true);
      xhttp.send();
    }
  }

  if(productValue == "produce"){
    if(areaValue == "02324"){
      xhttp.open("GET", "/pro1Out", true);
      xhttp.send();
    }
    if(areaValue == "02382"){
      xhttp.open("GET", "/pro2Out", true);
      xhttp.send();
    }
  }
}

function success(){
  let data = JSON.parse(xhttp.response);

  let rows = data.map((row) =>
    <tr key={JSON.stringify(row)}>
        <td> { row.name }</td>
        <td> { row.price }</td>
    </tr>
  );
  let element =(
        <table id="myTable">
        <tbody>
            {rows}
        </tbody>
        </table>
  );

  ReactDOM.render(
    element,
    document.getElementById('productsTable')
  );
  /*
   datatable CSS
   https://datatables.net/
   https://github.com/fiduswriter/Simple-DataTables
  */
  const dataTable = new simpleDatatables.DataTable("#myTable");

}
function error(){
  console.log(xhttp.readyState);
  console.log(xhttp.status);
}

function clear(){
  ReactDOM.unmountComponentAtNode(document.getElementById("productsTable"));
}

//add event listeners
btn.addEventListener('click', clear)
document.getElementById("products").addEventListener('change', chkDeals);
document.getElementById("location").addEventListener('change', chkDeals);