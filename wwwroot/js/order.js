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

    // Event handler for product selection
    $("#Products").on("change", function () {
        const productId = $(this).val(); // Get selected product ID

        // Fetch product details based on the selected product
        $.ajax({
            url: `/Products/GetProductDetails/${productId}`,
            type: "GET",
            success: function (response) {
                console.log("Product Details:", response);

                // Store fetched product details in hidden fields for reference
                $("#Quantity").data("maxQuantity", response.availableQuantity); // Set max quantity
                $("#Quantity").data("price", response.price); // Set price
                $("#TotalPrice").val(response.price);
            },
            error: function (error) {
                console.error("Error fetching product details:", error);
            }
        });
    });

    // Event handler for quantity input
    $("#Quantity").on("input", function () {
        const enteredQuantity = parseInt($(this).val());
        const maxQuantity = $(this).data("maxQuantity");
        const price = $(this).data("price");

        // Validate entered quantity
        if (enteredQuantity > maxQuantity) {
            // Show an error message if quantity exceeds available quantity
            $("#quantityDiv").after(
                `<div class="error-message text-danger">Quantity cannot exceed ${maxQuantity}.</div>`
            );
            $(this).addClass("is-invalid");
            $("#TotalPrice").val(""); // Clear total price
        } else if (enteredQuantity == 0 || !enteredQuantity){
            $("#TotalPrice").val(price);
        }

        else {
            // Remove error message and update total price
            $(".error-message").remove();
            $(this).removeClass("is-invalid");

            // Calculate total price
            const totalPrice = enteredQuantity * price;
            $("#TotalPrice").val(totalPrice.toFixed(2)); // Update total price
        }
    });

    //Event handler for Date
    $("#Date").on("input", function () {
        const pickedDate = new Date($(this).val());
        const today = new Date();

        // Normalize both dates to ensure only the date part is compared
        pickedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (pickedDate < today) {
            // Show error message if not already shown
            if (!$("#dateDiv .error-message").length) {
                $("#dateDiv").after(
                    `<div class="error-message text-danger">Order Date cannot be before today.</div>`
                );
            }
            $(this).addClass("is-invalid");
        } else {
            // Remove the error message and invalid class if the date is valid
            $(".error-message").remove();
            $(this).removeClass("is-invalid");
            $(this).addClass("is-valid");
        }
    });
});
