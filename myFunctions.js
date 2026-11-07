$(document).ready(function() {

    // إظهار/إخفاء تفاصيل السيارة (يمكن إظهار عدة سيارات معاً)
    $('.toggle-details').on('click', function() {
        $(this).closest('tr').next('.car-details-row').toggle();
    });

    // زر متابعة: يظهر الفورم بعد اختيار سيارة واحدة على الأقل
    $('#continueBtn').on('click', function() {
        if ($('.select-car:checked').length === 0) {
            alert("يرجى اختيار سيارة واحدة على الأقل.");
        } else {
            $('#bookingSection').slideDown();
        }
    });

    // التحقق من صحة مدخلات نموذج الحجز
    $('#rentalForm').on('submit', function(e) {
        e.preventDefault();

        let isValid = true;
        let errorMessage = "";

        // التأكد من اختيار سيارة
        if ($('.select-car:checked').length === 0) {
            errorMessage += "يرجى اختيار سيارة واحدة على الأقل.\n";
            isValid = false;
        }

        // الاسم الكامل (اختياري، أحرف عربية فقط)
        let fullName = $('#fullName').val().trim();
        if (fullName !== "") {
            let arabicRegex = /^[\u0600-\u06FF\s]+$/;
            if (!arabicRegex.test(fullName)) {
                errorMessage += "الاسم الكامل يجب أن يتكون من أحرف عربية فقط.\n";
                isValid = false;
            }
        }

        // الرقم الوطني (إلزامي، 11 خانة، أول خانتين 01-14)
        let nationalId = $('#nationalId').val().trim();
        let nationalIdRegex = /^(0[1-9]|1[0-4])[0-9]{9}$/;
        if (nationalId === "") {
            errorMessage += "الرقم الوطني حقل إلزامي.\n";
            isValid = false;
        } else if (!nationalIdRegex.test(nationalId)) {
            errorMessage += "الرقم الوطني غير صالح (يجب أن يكون 11 خانة وتبدأ بالمحافظة بين 01 و 14).\n";
            isValid = false;
        }

        // تاريخ البداية
        let startDateStr = $('#startDate').val().trim();
        if (startDateStr === "") {
            errorMessage += "تاريخ بداية التأجير حقل إلزامي.\n";
            isValid = false;
        }

        // تاريخ النهاية
        let endDateStr = $('#endDate').val().trim();
        if (endDateStr === "") {
            errorMessage += "تاريخ نهاية التأجير حقل إلزامي.\n";
            isValid = false;
        }

        // التسلسل الزمني
        if (startDateStr !== "" && endDateStr !== "") {
            let startDate = new Date(startDateStr);
            let endDate = new Date(endDateStr);
            if (endDate <= startDate) {
                errorMessage += "تاريخ نهاية التأجير يجب أن يكون لاحقاً لتاريخ البداية.\n";
                isValid = false;
            }
        }

        // رقم الموبايل (اختياري، Syriatel أو MTN)
        let mobile = $('#mobile').val().trim();
        if (mobile !== "") {
            let mobileRegex = /^09[345689][0-9]{7}$/;
            if (!mobileRegex.test(mobile)) {
                errorMessage += "رقم الموبايل غير صحيح (يجب أن يطابق شبكتي Syriatel أو MTN).\n";
                isValid = false;
            }
        }

        // البريد الإلكتروني (اختياري)
        let email = $('#email').val().trim();
        if (email !== "") {
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorMessage += "البريد الإلكتروني المدخل غير صالح.\n";
                isValid = false;
            }
        }

        // عرض الأخطاء أو النتيجة
        if (!isValid) {
            alert("يرجى تصحيح الأخطاء التالية:\n\n" + errorMessage);
        } else {
            let start = new Date(startDateStr);
            let end = new Date(endDateStr);
            let days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

            let carsText = "";
            let dailyTotal = 0;
            $('.select-car:checked').each(function() {
                let carName = $(this).closest('tr').find('td').eq(1).text();
                dailyTotal += Number($(this).data('price'));
                carsText += "- " + carName + ": " + days + " يوم\n";
            });
            let totalAmount = days * dailyTotal;
            let discount = 0;
            if (days > 10) {
                discount = totalAmount * 0.05;
                totalAmount -= discount;
            }

            let resultMessage = "تم الحجز بنجاح!\n\n" +
                "السيارات المختارة:\n" + carsText + "\n" +
                "المبلغ قبل الخصم: " + (days * dailyTotal) + " ل.س\n" +
                (days > 10 ? "خصم 5%: " + discount + " ل.س\n" : "") +
                "المبلغ الإجمالي النهائي: " + totalAmount + " ل.س";

            alert(resultMessage);
        }
    });

});