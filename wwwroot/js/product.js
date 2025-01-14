$(document).ready(function () {
    //------------- ADD PRODUCT USING AJAX (CLIENT SIDE REQUEST)-------------
    $("#submitButton").on("click", function (e) {

        $(".error-message").remove();

        const productName = $("#ProductName").val();
        const productPrice = $("#ProductPrice").val();
        const productDescription = $("#Description").val();
        const productQuantity = $("#Quantity").val();

        let raiseError = false;

        if (productName.length == 0) {
            $("#productNameDiv").after(`<div class="error-message text-danger">Product name is required.</div>`);
            //$("#productName").classList.add(("is-invalid"));
            raiseError = true;
        }

        if (productPrice.length == 0) {
            $("#productPriceDiv").after(`<div class="error-message text-danger">Product price is required.</div>`);
            raiseError = true;
        }

        if (productDescription.length == 0) {
            $("#productDescDiv").after(`<div class="error-message text-danger">Product description is required.</div>`);
            raiseError = true;
        }

        if (productQuantity.length == 0) {
            $("#productQuantityDiv").after(`<div class="error-message text-danger">Product quantity is required.</div>`);
            raiseError = true;
        }


        if (raiseError) {
            return;
        }

        e.preventDefault(); //Prevent the default form submission

        //PREVIOUSLY USING OBJECT FOR THE DATA (WHEN NO IMAGE COLUMN)
        // var productData = {
        //     ProductName: $("#ProductName").val(),
        //     ProductPrice: parseInt($("#ProductPrice").val())
        // };

        //Create a formData object
        var formData = new FormData();

        //Append the fields to the FormData object
        formData.append("ProductName", $("#ProductName").val());
        formData.append("Description", $("#Description").val());
        formData.append("ProductPrice", parseFloat($("#ProductPrice").val()));
        formData.append("Quantity", parseInt($("#Quantity").val()));


        //Append the file(image) to the FormData object
        var fileInput = $("#ProductImg")[0]; // Access the file input field
        if (fileInput.files.length > 0) {
            formData.append("ProductImgFile", fileInput.files[0]); //Append the first file
        } else {
            alert("Please select an image. "); //Validate that a file is selected
            return;
        }

        //AJAX CALL
        $.ajax({
            url: "/Products/InsertProduct",
            type: "POST",

            // contentType:"application/json", //When not using FormData
            contentType: false, //Tell jQuery not to set the content type header

            // data: JSON.stringify(productData), //When not using FormData
            data: formData,

            processData: false, // Prevent jQuery from processing the FormData object

            success: function (response) {
                $("#message").html(response.message);
                $("#productsTable").DataTable().ajax.reload(); // It refreshes the DataTable
            },
        });
    });


    // --------- BINDING/INTEGRATING JQUERY DATATABLE-------------
    bindDatatable();

    function bindDatatable() {
        datatable = $('#productsTable')
            .DataTable({
                //AJAX Call in the Data Table for the Refreshing and Fetching data.
                "ajax": {
                    "url": "/Products/GetProducts",
                    "type": "GET",
                    "datatype": "json"
                },
                "serverSide": false,
                "processing": true,
                "searchable": true,
                "order": [[0, 'asc']],
                "language": {
                    "emptyTable": "No record found.",
                    "processing":
                        '<i class="fa fa-spinner fa-spin fa-3x fa-fw" style="color:#2a2b2b;"></i><span class="sr-only">Loading...</span> '
                },
                dom: 'Bfrtip', // Use 'Bfrtip' for buttons, filter, etc.
                buttons: [
                    'copy', 'csv', 'excel', 'pdf', 'print'
                ],
                "columns": [
                    {
                        "data": "productID",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "productName",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "descriptions",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "price",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "quantity",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "productImg",
                        "render": function (data) {
                            return `<img src="${data}" alt="Product Image" style="width: 100px; height: auto;" />`;
                        }
                    },
                    {
                        "data": null,
                        "render": function (row) {
                            return `
                            <button class="btn btn-primary btn-edit"
                                id="editButton"
                                data-id="${row.productID}"
                                data-name="${row.productName}"
                                data-price="${row.price}"
                                data-img="${row.productImg}"
                                data-descriptions="${row.descriptions}"
                                data-quantity="${row.quantity}"
                                data-bs-toggle="modal"
                                data-bs-target="#updateModal">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-delete"
                                id="deleteButton"
                                data-id="${row.productID}"
                                data-bs-toggle="modal"
                                data-bs-target="#deleteModal">
                                <i class="fa fa-trash"></i>
                            </button>`;
                        }
                    },
                ]
            });
    };


    //------------- UPDATE PRODUCT USING AJAX (CLIENT SIDE REQUEST)-------------
    $(document).on("click", ".btn-edit", function () {
        console.log("EDIT BUTTON CLICKED");


        debugger;
        const id = $(this).data("id");
        const name = $(this).data("name");
        const price = $(this).data("price");
        const img = $(this).data("img");
        const descriptions = $(this).data("descriptions");
        const quantity = $(this).data("quantity");

        console.log(price);

        $("#updateModalLabel").text("Edit Product");
        $("#modalBody").html(`
                <form id="editForm"  enctype="multipart/form-data">
                    <div class="input-group mt-3">
                        <span class="input-group-text" for="editProductID">Product ID: </span>
                        <input class="form-control" type="text" id="editProductID" name="editProductID" value="${id}" disabled />
                    </div>
                    <div class="input-group mt-3" id="productNameDiv">
                        <span class="input-group-text" for="editProductName">Product Name: </span>
                        <input class="form-control" type="text" id="editProductName" name="editProductName" value="${name}" required />
                    </div>
                    <div class="input-group mt-3" id="productPriceDiv">
                        <span class="input-group-text" for="editProductPrice">Product Price: </span>
                        <input class="form-control" type="number" id="editProductPrice" name="editProductPrice" value="${price}" required />
                    </div>
                    <div class="input-group mt-3" id="productDescriptionDiv">
                        <span class="input-group-text" for="editDescription">Description: </span>
                        <textarea class="form-control" type="text" id="editDescription" name="editDescription" required >${descriptions}</textarea>
                    </div>
                    <div class="input-group mt-3" id="productQuantityDiv">
                        <span class="input-group-text" for="editQuantity">Quantity: </span>
                        <input class="form-control" type="number" id="editQuantity" name="editQuantity" value="${quantity}" required />
                    </div>
                    <div class="mt-3">
                        <label for="editProductImg" class="form-label mx-2">Product Image: </label>
                        <img src="${img}" alt="Product Image" class="img-fluid mb-2" style="max-width: 100px;">
                        <input type="file" class="form-control" id="editProductImg" name="ProductImgFile">
                    </div>
                </form>
            `);

        $("#modalFooter").html(`
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" id="modalUpdateButton">Save changes</button>
            `);

        $("#modalUpdateButton").off("click").on("click", function () {
            console.log($("#editProductName").val());

            $(".error-message").remove();

            const productName = $("#editProductName").val();
            const productPrice = $("#editProductPrice").val();
            const productDescription = $("#editDescription").val();
            const productQuantity = $("#editQuantity").val();

            let raiseError = false;

            if (productName.length == 0) {
                $("#productNameDiv").after(`<div class="error-message text-danger">Product name is required.</div>`);
                raiseError = true;
            }

            if (productPrice.length == 0) {
                $("#productPriceDiv").after(`<div class="error-message text-danger">Product price is required.</div>`);
                raiseError = true;
            }

            if (productDescription.length == 0) {
                $("#productDescriptionDiv").after(`<div class="error-message text-danger">Product description is required.</div>`);
                raiseError = true;
            }

            if (productQuantity.length == 0) {
                $("#productQuantityDiv").after(`<div class="error-message text-danger">Product quantity is required.</div>`);
                raiseError = true;
            }


            if (raiseError) {
                return;
            }

            //CONDITION IF THE FIELDS ARE EMPTY
            // if($("#editProductName").val().length == 0 || $("#editProductPrice").val().length == 0){
            //     alert("Please fill out all the fields");
            //     return;
            // }

            var formData = new FormData();

            // Append form fields
            formData.append("ProductID", $("#editProductID").val());
            formData.append("ProductName", $("#editProductName").val());
            formData.append("Price", $("#editProductPrice").val());
            formData.append("Descriptions", $("#editDescription").val());
            formData.append("Quantity", $("#editQuantity").val());

            // Append file if selected
            const fileInput = $("#editProductImg")[0];
            console.log("Checking: ", fileInput.files[0]);
            console.log("Checking img: ", img);
            if (fileInput.files.length > 0) {
                formData.append("ProductImgFile", fileInput.files[0]);
            }

            $.ajax({
                url: "/Products/UpdateProduct",
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response.success == false) {
                        alert(response.message);
                    } else {
                        alert(response.message);
                        $("#productsTable").DataTable().ajax.reload();
                        $("#updateModal").modal("hide");
                    }
                },
                error: function (error) {
                    console.error("Error updating product:", error);
                }
            });
        });
    });



    //------------- DELETE PRODUCT USING AJAX (CLIENT SIDE REQUEST)-------------
    $(document).on("click", ".btn-delete", function () {
        console.log("DELETE BUTTON CLICKED");
        const id = $(this).data("id");

        $("#deleteModalLabel").text("Delete Product");
        $("#dmodalBody").html(`
                <h3>
                    Confirmation!
                </h3>
                <div class="mt-3">
                    Are you sure you want to delete this product?
                </div>
            `);
        $("#modalDeleteButton").off("click").on("click", function () {
            $.ajax({
                url: `/Products/DeleteProduct/${id}`,
                type: "POST",
                success: function (response) {
                    $("#productsTable").DataTable().ajax.reload();
                    $("#deleteModal").modal("hide");
                },
                error: function (error) {
                    console.error("Error deleting product:", error);
                }
            });
        });
    });
});

//------ THIS FUNCTION IS FOR THE FETCHING OF DATA PREVIOUSLY WHEN NOT USING JQUERY DATATABLE LIBRARY
// function fetchData(){
//     $(document).ready(function(){
//        $.ajax({
//            url: "/Products/GetProducts",
//            type: "GET",
//            contentType:"application/json",
//            success: function(response){
//                console.log(response);
//                // first empty the existing table
//                $("#productsTable tbody").empty();
//                //fetching and storing data in row variable
//                response.forEach(function(product){
//                    var row = `
//                        <tr>
//                            <td>${product.productID}</td>
//                            <td>${product.productName}</td>
//                            <td>${product.productPrice}</td>
//                        </tr>
//                    `;
//                    //appending the tbody after the data is fetched
//                    $("#productsTable tbody").append(row);
//                });
//            },
//            error: function(error){
//                console.error("Error fetching data: ",error)
//            }
//        });
//    });
// };
// fetchData();
