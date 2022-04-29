let xhttp = new XMLHttpRequest(); 
      
xhttp.addEventListener("load",success); 
xhttp.addEventListener("error",error);  
xhttp.open("GET", "/shoppingListOut", true); 
xhttp.send();

/* 
https://reactjs.org/docs/lists-and-keys.html
https://en.wikipedia.org/wiki/Map_(higher-order_function)
*/
function success(){
  let data = JSON.parse(xhttp.response);
  let rows = data.map((row) => 
    <tr key={JSON.stringify(row)}>
        <td className="row" id="row"> { row.item }</td>
    </tr>
  );
  let element =(
    <div>
        <table id="myTable">
        <tbody>
            {rows}
        </tbody>
        </table>
    </div>
  );
  
  ReactDOM.render(
    element,
    document.getElementById('shoppingList')
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