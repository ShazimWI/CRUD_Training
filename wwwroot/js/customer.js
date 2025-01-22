$(document).ready(function () {
    //------------- ADD CUSTOMER USING AJAX (CLIENT SIDE REQUEST)-------------
    $("#customerSubmitButton").on("click", function (e) {

        $(".error-message").remove();

        const firstName = $("#FirstName").val();
        const lastName = $("#LastName").val();
        const email = $("#Email").val();
        const phone = $("#Phone").val();
        const address = $("#Address").val();
        const city = $("#City").val();
        const country = $("#Country").val();

        let raiseError = false;

        if (firstName.length == 0 ) {
            $("#cusFNameDiv").after(`<div class="error-message text-danger">First name is required.</div>`);
            raiseError = true;
        }

        if (lastName.length == 0) {
            $("#cusLNameDiv").after(`<div class="error-message text-danger">Last name is required.</div>`);
            raiseError = true;
        }

        if (email.length == 0) {
            $("#cusEmailDiv").after(`<div class="error-message text-danger">Email is required.</div>`);
            raiseError = true;
        }


        if (raiseError) {
            return;
        }

        e.preventDefault(); //Prevent the default form submission

        //PREVIOUSLY USING OBJECT FOR THE DATA (WHEN NO IMAGE COLUMN)
         var customerData = {
             FirstName: firstName,
             LastName: lastName,
             Email: email,
             PhoneNumber: phone,
             Address: address,
             City: city,
             Country: country,
         };

        //AJAX CALL
        $.ajax({
            url: "/Customer/InsertCustomer",
            type: "POST",
            contentType:"application/json",
            data: JSON.stringify(customerData),
            success: function (response) {
                $("#message").html(response.message);
                $("#customerTable").DataTable().ajax.reload(); // It refreshes the DataTable
            },
        });
    });

    // --------- BINDING/INTEGRATING JQUERY DATATABLE-------------
    bindDatatable();

    function bindDatatable() {
        datatable = $('#customerTable')
            .DataTable({
                //AJAX Call in the Data Table for the Refreshing and Fetching data.
                "ajax": {
                    "url": "/Customer/GetCustomers",
                    "type": "GET",
                    "datatype": "json"
                },
                "serverSide": false,
                "processing": true,
                "searchable": true,
                "order": [[0, 'desc']],
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
                        "data": "customerID",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "firstName",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "lastName",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "email",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "phoneNumber",
                        "autoWidth": true,
                        "searchable": true,
                        "render": function (data) {
                            return data && data.trim() ? data : "---";
                        }
                    },
                    {
                        "data": "address",
                        "autoWidth": true,
                        "searchable": true,
                        "render": function (data) {
                            return data && data.trim() ? data : "-";
                        }
                    },
                    {
                        "data": "city",
                        "autoWidth": true,
                        "searchable": true,
                        "render": function (data) {
                            return data && data.trim() ? data : "-";
                        }
                    },
                    {
                        "data": "country",
                        "autoWidth": true,
                        "searchable": true,
                        "render": function (data) {
                            return data && data.trim() ? data : "-";
                        }
                    },
                    {
                        "data": null,
                        "render": function (row) {
                            return `
                            <button class="btn btn-primary mx-1 my-1 cus-btn-edit"
                                id="cusEditButton"
                                data-id="${row.customerID}"
                                data-firstname="${row.firstName}"
                                data-lastname="${row.lastName}"
                                data-email="${row.email}"
                                data-phone="${row.phoneNumber}"
                                data-address="${row.address}"
                                data-city="${row.city}"
                                data-country="${row.country}"
                                data-bs-toggle="modal"
                                data-bs-target="#cusUpdateModal">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button class="btn btn-danger mx-1 my-1 cus-btn-delete"
                                id="cusDeleteButton"
                                data-id="${row.customerID}"
                                data-bs-toggle="modal"
                                data-bs-target="#cusDeleteModal">
                                <i class="fa fa-trash"></i>
                            </button>`;
                        }
                    },
                ]
            });
    };

    //------------- UPDATE CUSTOMER USING AJAX (CLIENT SIDE REQUEST)-------------
    $(document).on("click", ".cus-btn-edit", function () {
        console.log("EDIT BUTTON CLICKED");


        debugger;
        const id = $(this).data("id");
        const firstname = $(this).data("firstname");
        const lastname = $(this).data("lastname");
        const email = $(this).data("email");
        const phone = $(this).data("phone");
        const address = $(this).data("address");
        const city = $(this).data("city");
        const country = $(this).data("country");

        $("#cusUpdateModalLabel").text("Edit Customer");
        $("#modalBody").html(`
                <form id="editForm"  enctype="multipart/form-data">
                    <div class="input-group mt-3">
                        <span class="input-group-text" for="editCustomerID">Customer ID: </span>
                        <input class="form-control" type="text" id="editCustomerID" name="editCustomerID" value="${id}" disabled />
                    </div>
                    <!-- First Name -->
                    <div class="input-group mt-3" id="editFNameDiv">
                        <span class="input-group-text" for="editFirstName">First Name: </span>
                        <input class="form-control" type="text" id="editFirstName" name="editFirstName" value="${firstname}" required />
                    </div>
                    
                    
                    <!-- Last Name -->
                    <div class="input-group mt-3" id="editLNameDiv">
                        <span class="input-group-text" for="editLastName">Last Name: </span>
                        <input class="form-control" type="text" id="editLastName" name="editLastName" value="${lastname}" required />
                    </div>
                    

                    <!-- Email -->
                    <div class="input-group mt-3" id="editEmailDiv">
                        <span class="input-group-text" for="editEmail">Email: </span>
                        <input class="form-control" type="email" id="editEmail" name="editEmail" value="${email}" required/>
                    </div>
                    

                    <!-- Phone Number-->
                    <div class="input-group mt-3">
                        <span class="input-group-text" for="editPhone">Phone No: </span>
                        <input class="form-control" type="tel" id="editPhone" name="editPhone" pattern="[0-9]{3}-[0-9]{8}" value="${phone}" required/>
                    </div>
                    

                    <!-- Address -->
                    <div class="input-group mt-3">
                        <span class="input-group-text" for="editAddress">Address: </span>
                        <input class="form-control" type="text" id="editAddress" name="editAddress" value="${address}" required/>
                    </div>
                    

                    <!-- City -->
                    <div class="input-group mt-3">
                        <span class="input-group-text" for="editCity">City: </span>
                        <input class="form-control" type="text" id="editCity" name="editCity" value="${city}" required />
                    </div>
                    

                    <!-- Country -->
                    <div class="input-group mt-3">
                        <span class="input-group-text" for="editCountry">Country: </span>
                        <input class="form-control" type="text" id="editCountry" name="editCountry" value="${country}" required />
                    </div>
                    
                </form>
            `);

        $("#modalFooter").html(`
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" id="modalUpdateButton">Save changes</button>
            `);

        $("#modalUpdateButton").off("click").on("click", function () {
            $(".error-message").remove();

            const firstName = $("#editFirstName").val();
            const lastName = $("#editLastName").val();
            const email = $("#editEmail").val();
            const phone = $("#editPhone").val();
            const address = $("#editAddress").val();
            const city = $("#editCity").val();
            const country = $("#editCountry").val();

            let raiseError = false;

            if (firstName.length == 0) {
                $("#editFNameDiv").after(`<div class="error-message text-danger">First name is required.</div>`);
                raiseError = true;
            }

            if (lastName.length == 0) {
                $("#editLNameDiv").after(`<div class="error-message text-danger">Last name is required.</div>`);
                raiseError = true;
            }

            if (email.length == 0) {
                $("#editEmailDiv").after(`<div class="error-message text-danger">Email is required.</div>`);
                raiseError = true;
            }

            if (raiseError) {
                return;
            }

            var customerData = {
                CustomerID: id,
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                PhoneNumber: phone,
                Address: address,
                City: city,
                Country: country,
            };

            $.ajax({
                url: "/Customer/UpdateCustomer",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(customerData),
                success: function (response) {
                    if (response.success == false) {
                        alert(response.message);
                    } else {
                        alert(response.message);
                        $("#customerTable").DataTable().ajax.reload();
                        $("#cusUpdateModal").modal("hide");
                    }
                },
                error: function (error) {
                    console.error("Error updating product:", error);
                }
            });
        });
    });



    //------------- DELETE CUSTOMER USING AJAX (CLIENT SIDE REQUEST)-------------
    $(document).on("click", ".cus-btn-delete", function () {
        console.log("DELETE BUTTON CLICKED");
        const id = $(this).data("id");

        $("#cusDeleteModalLabel").text("Delete Customer");
        $("#dmodalBody").html(`
                <h3>
                    Confirmation!
                </h3>
                <div class="mt-3">
                    Are you sure you want to delete this customer?
                </div>
            `);
        $("#cusModalDeleteButton").off("click").on("click", function () {
            $.ajax({
                url: `/Customer/DeleteCustomer/${id}`,
                type: "POST",
                success: function (response) {
                    $("#customerTable").DataTable().ajax.reload();
                    $("#cusDeleteModal").modal("hide");
                },
                error: function (error) {
                    console.error("Error deleting customer:", error);
                }
            });
        });
    });
});