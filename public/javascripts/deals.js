let xhttp = new XMLHttpRequest();

xhttp.addEventListener("load",success);
xhttp.addEventListener("error",error);

let btn = document.getElementById("clearButton");

function chkDropdown(){

  //get product dropdown
  var productMenu = document.getElementById('products');
  var productValue = productMenu.options[productMenu.selectedIndex].value;

  //none dropdown selected
  if(productValue == "none"){
    xhttp.open("GET", "/productsOut", true);
    xhttp.send();
  }

  //beverage dropdown selected
  if(productValue == "beverage"){
    xhttp.open("GET", "/productsBeverageOut", true);
    xhttp.send();
  }

  //snack dropdown selected
  if(productValue == "snack"){
    xhttp.open("GET", "/productsSnackOut", true);
    xhttp.send();
  }

  //bread dropdown selected
  if(productValue == "bread"){
    xhttp.open("GET", "/productsBreadOut", true);
    xhttp.send();
  }

  //meat dropdown selected
  if(productValue == "meat"){
    xhttp.open("GET", "/productsMeatOut", true);
    xhttp.send();
  }

  //produce dropdown selected
  if(productValue == "produce"){
    xhttp.open("GET", "/productsProduceOut", true);
    xhttp.send();
  }

}

//xhttp.send();

/*
https://reactjs.org/docs/lists-and-keys.html
https://en.wikipedia.org/wiki/Map_(higher-order_function)
*/
function success(){
  let data = JSON.parse(xhttp.response);

  let rows = data.map((row) =>
    <tr key={JSON.stringify(row)}>
        <td> { row.name }</td>
        <td> { row.price }</td>
        <td> { row.type }</td>
        <td> { row.area }</td>
    </tr>
  );
  console.log(rows);
  let element =(
    <div id='fullDiv'>
      <h2>Deals</h2>
        <table id="myTable">
        <thead>
        <tr><th>Name</th><th>Price</th><th>Type</th><th>Area</th></tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
        </table>
    </div>
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
document.getElementById("products").addEventListener('change', chkDropdown);