$(document).ready(function () {
    // Fetch Customers for the dropdown
    $.ajax({
        url: "/Customer/GetCustomers",
        type: "GET",
        success: function (response) {
            console.log("Customers API Response:", response);
            let customers = Array.isArray(response) ? response : response.data; //If response is not an array, response.data is used. Used when the API wraps the array inside another object, like { data: [...] }.

            if (!Array.isArray(customers)) {
                console.error("Customers is not an array. Check API response.");
                return;
            }

            customers.forEach(function (customer) {
                $("#Customers").append(`<option value="${customer.customerID}">${customer.fullName}</option>`);
            });
        },
        error: function (error) {
            console.error("Error fetching customers:", error);
        }
    });

    // Fetch Products for the Dropdown
    $.ajax({
        url: "/Products/GetProducts",
        type: "GET",
        success: function (response) {
            console.log("Products API Response:", response);
            let products = Array.isArray(response) ? response : response.data;

            if (!Array.isArray(products)) {
                console.error("Products is not an array. Check API response.");
                return;
            }

            products.forEach(function (product) {
                $("#Products").append(`<option value="${product.productID}">${product.productName}</option>`);
            });
        },
        error: function (error) {
            console.error("Error fetching products:", error);
        }
    });

    //Disabled Fields till the Product is not selected
    $("#Quantity").prop("disabled", true);
    $("#Date").prop("disabled", true);
    $("#TotalPrice").prop("disabled", true);

    // --------- BINDING/INTEGRATING JQUERY DATATABLE-------------
    bindDatatable();

    function bindDatatable() {
        datatable = $('#OrderTable')
            .DataTable({
                //AJAX Call in the Data Table for the Refreshing and Fetching data.
                "ajax": {
                    "url": "/Order/GetOrders",
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
                        "data": "orderNO",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "customerName",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "productName",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "orderDate",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "totalAmount",
                        "autoWidth": true,
                        "searchable": true
                    },
                    {
                        "data": "addedBy",
                        "autoWidth": true,
                        "searchable": true,
                        "render": function (data) {
                            return data && data.trim() ? data : "---";
                        }
                    },
                    {
                        "data": "addedOn",
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
                            <button class="btn btn-danger mx-1 my-1 ord-btn-delete"
                                id="ordDeleteButton"
                                data-id="${row.orderNO}"
                                data-bs-toggle="modal"
                                data-bs-target="#ordDeleteModal">
                                <i class="fa fa-trash"></i>
                            </button>`;
                        }
                    },
                ]
            });
    };


    // Event handler for product selection
    $("#Products").on("change", function () {

        $("#Quantity").val("");
        $("#Date").val("");
        

        //Enabling disabled fields
        $("#Quantity").prop("disabled", false);
        $("#Date").prop("disabled", false);
        $("#TotalPrice").prop("disabled", false);

        const productId = $(this).val(); // Get selected product ID

        // Fetch product details based on the selected product
        $.ajax({
            url: `/Products/GetProductDetails/${productId}`,
            type: "GET",
            success: function (response) {
                $(".error-message").remove();
                console.log("Product Details:", response);

                // Store fetched product details in hidden fields for reference
                $("#Quantity").data("maxQuantity", response.availableQuantity); // Set max quantity
                $("#Quantity").data("price", response.price); // Set price
                $("#TotalPrice").val(response.price);
                $("#quantityDiv").after(
                    `<div class="error-message text-success">Available Quantity ${response.availableQuantity}.</div>`
                );
            },
            error: function (error) {
                console.error("Error fetching product details:", error);
            }
        });
    });

    // Event handler for quantity input
    $("#Quantity").on("input", function () {
        $(this).removeClass("is-invalid");

        const enteredQuantity = parseInt($(this).val());
        const maxQuantity = $(this).data("maxQuantity");
        const price = $(this).data("price");

        // Validate entered quantity
        if (enteredQuantity > maxQuantity) {
            // Show an error message if quantity exceeds available quantity
            $(".error-message").replaceWith(
                `<div class="error-message text-danger">Quantity cannot exceed ${maxQuantity}.</div>`
            );
            $(this).addClass("is-invalid");

            $("#TotalPrice").val(""); // Clear total price
        } else if (enteredQuantity == 0 || !enteredQuantity){
            $("#TotalPrice").val(price);
            $(this).removeClass("is-valid");
        }
        else {
            // Remove error message and update total price
            $(".error-message").remove();
            $(this).removeClass("is-invalid");

            // Show available quantity
            $("#quantityDiv").after(
                `<div class="error-message text-success">Available Quantity ${maxQuantity}.</div>`
            );
            $(this).addClass("is-valid");

            // Calculate total price
            const totalPrice = enteredQuantity * price;
            $("#TotalPrice").val(totalPrice.toFixed(2)); // Update total price
        }
    });

    //Event handler for Date
    $("#Date").on("input", function () {
        $(this).removeClass("is-invalid");
        $("#date-error").remove();

        const pickedDate = new Date($(this).val());
        const today = new Date();

        // Normalize both dates to ensure only the date part is compared
        pickedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (pickedDate < today) {
            // Show error message if not already shown
            if (!$("#dateDiv .error-message").length) {
                $("#dateDiv").after(
                    `<div class="error-message text-danger" id="date-error">Order Date cannot be before today.</div>`
                );
            }
            $(this).addClass("is-invalid");
        } else {
            // Remove the error message and invalid class if the date is valid
            $("#dateDiv .error-message ").remove();
            $(this).removeClass("is-invalid");
            $(this).addClass("is-valid");
        }
    });

    //------------- ADD Order USING AJAX (CLIENT SIDE REQUEST)-------------
    $("#orderSubmitButton").on("click", function (e) {

        $(".error-message").remove();

        const customer = $("#Customers").val();
        const product = $("#Products").val();
        const quantity = parseInt($("#Quantity").val());
        const date = $("#Date").val();
        const totalPrice = $("#TotalPrice").val();
        const maxQuantity = parseInt($("#Quantity").data("maxQuantity"));
        const todayDate = new Date();

        console.log("Max Quantity: ", maxQuantity);

        todayDate.setHours(0, 0, 0, 0); // Normalize today's date

        let raiseError = false;

        if (!customer) {
            $("#customersDropdownDiv").after(`<div class="error-message text-danger">Please select customer.</div>`);
            raiseError = true;
        } else {
            $("#customersDropdownDiv .error-message").remove();
        }

        if (!product) {
            $("#productsDropdownDiv").after(`<div class="error-message text-danger">Please select product.</div>`);
            raiseError = true;
        } else {
            $("#productsDropdownDiv .error-message").remove();
        }

        if (!quantity || quantity <= 0) {
            $("#quantityDiv").after(`<div class="error-message text-danger">Please add a valid quantity.</div>`);
            raiseError = true;
        } else if (quantity > maxQuantity) {
            $("#quantityDiv").after(`<div class="error-message text-danger">Quantity cannot exceed ${maxQuantity}.</div>`);
            raiseError = true;
        } else {
            $("#quantityDiv .error-message").remove();
        }

        // Validate date
        if (!date) {
            $("#dateDiv").after(`<div class="error-message text-danger">Please select order date.</div>`);
            raiseError = true;
        } else {
            const selectedDate = new Date(date);
            selectedDate.setHours(0, 0, 0, 0); // Normalize selected date

            if (selectedDate < todayDate) {
                $("#dateDiv").after(`<div class="error-message text-danger">Order Date cannot be before today.</div>`);
                raiseError = true;
            } else {
                $("#dateDiv .error-message").remove();
            }
        }


        if (raiseError) {
            return;
        }

        e.preventDefault(); //Prevent the default form submission

        //PREVIOUSLY USING OBJECT FOR THE DATA (WHEN NO IMAGE COLUMN)
        var orderData = {
            CustomerID: customer,
            ProductID: product,
            Quantity: quantity,
            OrderDate: date,
            TotalAmount: totalPrice,
        };

        //AJAX CALL
        $.ajax({
            url: "/Order/InsertOrder",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(orderData),
            success: function (response) {
                $("#message").html(response.message);
                $("#OrderTable").DataTable().ajax.reload(); // It refreshes the DataTable
            },
            error: function (error) {
                console.error("Error inserting order:", error);
            },
        });
    });


    //------------- DELETE CUSTOMER USING AJAX (CLIENT SIDE REQUEST)-------------
    $(document).on("click", ".ord-btn-delete", function () {
        console.log("DELETE BUTTON CLICKED");
        const id = $(this).data("id");

        $("#ordDeleteModalLabel").text("Delete Order");
        $("#dmodalBody").html(`
                <h3>
                    Confirmation!
                </h3>
                <div class="mt-3">
                    Are you sure you want to delete this order?
                </div>
            `);
        $("#ordModalDeleteButton").off("click").on("click", function () {
            $.ajax({
                url: `/Order/DeleteOrder/${id}`,
                type: "POST",
                success: function (response) {
                    $("#OrderTable").DataTable().ajax.reload();
                    $("#ordDeleteModal").modal("hide");
                },
                error: function (error) {
                    console.error("Error deleting order:", error);
                }
            });
        });
    });
});
